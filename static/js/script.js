const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const currentSubjectText = document.getElementById("current-subject");

let currentSubject = "Geral";

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    addMessage(message, "user");
    messageInput.value = "";

    sendMessageToBackend(message);
});

function setSubject(button, subject) {
    currentSubject = subject;
    currentSubjectText.textContent = subject;

    const buttons = document.querySelectorAll(".subject");
    buttons.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    addMessage(`Área alterada para: ${subject}`, "bot");
}

function sendSuggestion(text) {
    messageInput.value = text;
    chatForm.requestSubmit();
}

function newChat() {
    chatBox.innerHTML = `
        <div class="message bot">
          <div class="avatar">🤖</div>
          <div class="content">
            <div class="meta">EngenIA • agora</div>
            <div class="bubble">
              Nova conversa iniciada. Escolha uma matéria ou digite sua dúvida.
            </div>
          </div>
        </div>
    `;
}

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.textContent = sender === "user" ? "👤" : "🤖";

    const content = document.createElement("div");
    content.classList.add("content");

    const meta = document.createElement("div");
    meta.classList.add("meta");
    meta.textContent = `${sender === "user" ? "Você" : "EngenIA"} • ${getTime()}`;

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.innerHTML = formatText(text);

    content.appendChild(meta);
    content.appendChild(bubble);

    if (sender === "bot") {
        const copyButton = document.createElement("button");
        copyButton.classList.add("copy-btn");
        copyButton.textContent = "📋 Copiar resposta";
        copyButton.onclick = () => copyText(text, copyButton);
        content.appendChild(copyButton);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addLoadingMessage() {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "bot");
    loadingDiv.id = "loading-message";

    loadingDiv.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="content">
            <div class="meta">EngenIA • pensando</div>
            <div class="bubble">
                <div class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoadingMessage() {
    const loadingMessage = document.getElementById("loading-message");

    if (loadingMessage) {
        loadingMessage.remove();
    }
}

async function sendMessageToBackend(message) {
    addLoadingMessage();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                subject: currentSubject
            })
        });

        const data = await response.json();

        removeLoadingMessage();

        if (data.answer) {
            addMessage(data.answer, "bot");
        } else {
            addMessage("Não consegui gerar uma resposta no momento.", "bot");
        }

    } catch (error) {
        removeLoadingMessage();
        addMessage("Erro ao conectar com o servidor. Verifique se o Flask está rodando.", "bot");
    }
}

function formatText(text) {
    return text
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}

function copyText(text, button) {
    navigator.clipboard.writeText(text);
    button.textContent = "✅ Copiado!";

    setTimeout(() => {
        button.textContent = "📋 Copiar resposta";
    }, 2000);
}

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}