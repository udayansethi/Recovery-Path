// Hope AI Recovery Companion - Client Script
let aiConversationHistory = [];

function toggleAIChat() {
    const chatWin = document.getElementById("ai-chat-window");
    const launcher = document.getElementById("ai-chat-launcher");
    if (!chatWin) return;

    const isClosed = chatWin.style.display === "none" || chatWin.style.display === "";
    if (isClosed) {
        chatWin.style.display = "flex";
        launcher.classList.add("ai-launcher-active");
        const input = document.getElementById("ai-chat-input");
        if (input) input.focus();
    } else {
        chatWin.style.display = "none";
        launcher.classList.remove("ai-launcher-active");
    }
}

function sendQuickPrompt(promptText) {
    const input = document.getElementById("ai-chat-input");
    if (input) {
        input.value = promptText;
        const form = document.getElementById("ai-chat-form");
        if (form) {
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
    }
}

async function handleAIChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("ai-chat-input");
    const sendBtn = document.getElementById("ai-send-btn");
    const userText = input.value.trim();
    if (!userText) return;

    // Append User Message
    appendAIChatMessage("user", userText);
    aiConversationHistory.push({ role: "user", content: userText });
    input.value = "";
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Show Typing Indicator
    const typingId = showAITypingIndicator();

    try {
        const response = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: aiConversationHistory })
        });

        const data = await response.json();
        removeAITypingIndicator(typingId);

        if (data.is_crisis) {
            const crisisBox = document.getElementById("ai-crisis-box");
            if (crisisBox) crisisBox.style.display = "block";
        }

        const reply = data.reply || "I am here with you. Take a deep, gentle breath.";
        appendAIChatMessage("bot", reply);
        aiConversationHistory.push({ role: "assistant", content: reply });
    } catch (err) {
        removeAITypingIndicator(typingId);
        appendAIChatMessage("bot", "I am having trouble connecting right now, but please remember you are taking meaningful steps today. Take a slow, deep breath.");
    } finally {
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
    }
}

function formatAIMarkdown(text) {
    if (!text) return "";
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic *text*
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Bullet points
    formatted = formatted.replace(/^[•\-\*]\s+(.*)$/gm, "<li>$1</li>");
    formatted = formatted.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
    // Line breaks
    formatted = formatted.replace(/\n/g, "<br>");
    return formatted;
}

function appendAIChatMessage(sender, text) {
    const container = document.getElementById("ai-chat-messages");
    if (!container) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-msg ai-msg-${sender}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "ai-msg-content";
    contentDiv.innerHTML = formatAIMarkdown(text);

    msgDiv.appendChild(contentDiv);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function showAITypingIndicator() {
    const container = document.getElementById("ai-chat-messages");
    if (!container) return null;

    const id = "typing-" + Date.now();
    const typingDiv = document.createElement("div");
    typingDiv.id = id;
    typingDiv.className = "ai-msg ai-msg-bot ai-typing-indicator";
    typingDiv.innerHTML = `<div class="ai-msg-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;

    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeAITypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
}

// -------------------------------------------------------------
// SOS Craving De-escalator & 4-7-8 Urge Surfing Functions
// -------------------------------------------------------------
let breathInterval = null;
let isBreathingActive = false;
let urgeTimerInterval = null;
let urgeSecondsLeft = 180; // 3 minutes

function openSOSModal() {
    const modal = document.getElementById("sos-modal-overlay");
    if (modal) modal.style.display = "grid";
}

function closeSOSModal() {
    const modal = document.getElementById("sos-modal-overlay");
    if (modal) modal.style.display = "none";
    stopBreathingGuide();
}

function toggleBreathingGuide() {
    if (isBreathingActive) {
        stopBreathingGuide();
    } else {
        startBreathingGuide();
    }
}

function startBreathingGuide() {
    isBreathingActive = true;
    const btn = document.getElementById("sos-breath-toggle-btn");
    const circle = document.getElementById("sos-breath-circle");
    const text = document.getElementById("sos-breath-text");
    const phase = document.getElementById("sos-breath-phase");

    if (btn) btn.innerHTML = "Pause Breathing";

    function runBreathCycle() {
        if (!isBreathingActive) return;

        // Phase 1: Inhale (4s)
        if (circle) {
            circle.className = "sos-breath-circle sos-inhale";
        }
        if (text) text.innerText = "INHALE";
        if (phase) phase.innerText = "Inhale slowly through your nose for 4 seconds...";

        setTimeout(() => {
            if (!isBreathingActive) return;
            // Phase 2: Hold (7s)
            if (circle) {
                circle.className = "sos-breath-circle sos-hold";
            }
            if (text) text.innerText = "HOLD";
            if (phase) phase.innerText = "Hold your breath gently for 7 seconds...";

            setTimeout(() => {
                if (!isBreathingActive) return;
                // Phase 3: Exhale (8s)
                if (circle) {
                    circle.className = "sos-breath-circle sos-exhale";
                }
                if (text) text.innerText = "EXHALE";
                if (phase) phase.innerText = "Exhale completely through your mouth for 8 seconds...";

                setTimeout(() => {
                    if (isBreathingActive) runBreathCycle();
                }, 8000);
            }, 7000);
        }, 4000);
    }

    runBreathCycle();
}

function stopBreathingGuide() {
    isBreathingActive = false;
    const btn = document.getElementById("sos-breath-toggle-btn");
    const circle = document.getElementById("sos-breath-circle");
    const text = document.getElementById("sos-breath-text");
    const phase = document.getElementById("sos-breath-phase");

    if (btn) btn.innerHTML = "Start 4-7-8 Breathing";
    if (circle) circle.className = "sos-breath-circle";
    if (text) text.innerText = "READY";
    if (phase) phase.innerText = "Click Start to begin calming your nervous system.";
}

function toggleUrgeTimer() {
    const btn = document.getElementById("sos-timer-btn");
    if (urgeTimerInterval) {
        clearInterval(urgeTimerInterval);
        urgeTimerInterval = null;
        if (btn) btn.innerHTML = "Resume Timer";
    } else {
        if (btn) btn.innerHTML = "Pause Timer";
        urgeTimerInterval = setInterval(() => {
            if (urgeSecondsLeft > 0) {
                urgeSecondsLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(urgeTimerInterval);
                urgeTimerInterval = null;
                if (btn) btn.innerHTML = "Completed!";
            }
        }, 1000);
    }
}

function resetUrgeTimer() {
    if (urgeTimerInterval) {
        clearInterval(urgeTimerInterval);
        urgeTimerInterval = null;
    }
    urgeSecondsLeft = 180;
    updateTimerDisplay();
    const btn = document.getElementById("sos-timer-btn");
    if (btn) btn.innerHTML = "Start Timer";
}

function updateTimerDisplay() {
    const display = document.getElementById("sos-timer-display");
    if (!display) return;
    const mins = Math.floor(urgeSecondsLeft / 60);
    const secs = urgeSecondsLeft % 60;
    display.innerText = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

async function fetchSOSGrounding() {
    const btn = document.getElementById("sos-grounding-btn");
    const body = document.getElementById("sos-grounding-content");
    if (!btn || !body) return;

    btn.disabled = true;
    btn.innerHTML = "Generating...";
    body.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 0;color:var(--color-accent-400);">
            <div class="ai-typing-indicator"><div class="ai-msg-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>
            <span>Generating 5-4-3-2-1 sensory grounding steps...</span>
        </div>
    `;

    try {
        const response = await fetch("/api/ai/sos-grounding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urge_level: 5 })
        });
        const data = await response.json();
        const grounding = data.grounding || "Take 3 slow deep breaths. You are in control.";
        body.innerHTML = `<div class="sos-grounding-text">${formatAIMarkdown(grounding)}</div>`;
        btn.innerHTML = "Refresh Steps";
    } catch (err) {
        body.innerHTML = `<p style="color:#f87171;margin:0;">Take 3 slow deep breaths. Splash cold water on your face.</p>`;
        btn.innerHTML = "Retry";
    } finally {
        btn.disabled = false;
    }
}

