
function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  })
  .then(response => response.json())
  .then(data => {
    const reply = data.message || data.error || "No response";
    appendMessage("bot", reply);
  })
  .catch(error => {
    console.error("Error:", error);
    appendMessage("bot", "An error occurred. Please try again.");
  });
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", `${sender}-message`);

  const formattedText = formatMarkdown(text);
  msgDiv.innerHTML = `<p>${formattedText}</p>`;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Simple Markdown parser
function formatMarkdown(text) {
  // Basic formatting
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // bold
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>"); // italic
  text = text.replace(/`(.*?)`/g, "<code>$1</code>"); // inline code

  // New lines and bullet points
  text = text.replace(/\n/g, "<br>");
  text = text.replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>");

  // Wrap <li> in <ul> if found
  if (text.includes("<li>")) {
    text = `<ul>${text}</ul>`;
  }

  return text;
}

