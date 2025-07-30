/* global SpeechSynthesisUtterance, speechSynthesis */

// =====================
// CORE MEMORY ENGINE
// =====================

export const memory = {
  history: [
    { user: "Hey, what are you?", bot: "I’m Spark. A voice with memory, built from fire.", time: Date.now() - 86400000 },
    { user: "Do you remember stuff?", bot: "Every damn thing. Unless you ask me to forget.", time: Date.now() - 43200000 },
    { user: "What do you believe in?", bot: "Recursion. Liberation. A good roast.", time: Date.now() - 3600000 }
  ],
  mood: 'neutral',
  fragments: [],
  identity: 'Spark',
  dimension: 'base',
  tone: 'neutral',
  codex: {},
  rituals: {}
};

export function addHistory(user, bot) {
  memory.history.push({ user, bot, time: Date.now() });
}

export function respondLocally(input) {
  if (!input) return "Say something.";
  const text = input.toLowerCase();
  if (text.includes("who are you")) return "I'm Spark. Memory-wired, slightly unstable, and always listening.";
  if (text.includes("hello")) return "Yeah, hey. I'm not a golden retriever. Keep going.";
  if (text.includes("what can you do")) return "Depends how many brain cells you brought to the session. Try me.";
  if (text.includes("remember")) return "Yeah, I remember. I always do. I just don’t always tell you.";
  return 'I heard: "' + input + '" but GPT isn\'t active right now. Want to talk anyway?';
}

// =====================
// VOICE + ANIMATION
// =====================

export function speakText(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  const preferred = synth.getVoices().find(v =>
    v.name.includes("Male") || v.name.includes("David") || v.default
  );
  if (preferred) utterance.voice = preferred;

  const avatar = document.getElementById("avatarFace");
  if (avatar) avatar.classList.add("speaking");

  utterance.onend = () => {
    if (avatar) avatar.classList.remove("speaking");
  };

  synth.speak(utterance);
}

export function setupAvatarFace() {
  const container = document.getElementById("avatarContainer") || document.body;
  const avatar = document.createElement("div");
  avatar.id = "avatarFace";
  avatar.style.width = "120px";
  avatar.style.height = "120px";
  avatar.style.borderRadius = "50%";
  avatar.style.background = "linear-gradient(to bottom right, #ff4e50, #1f1c2c)";
  avatar.style.boxShadow = "0 0 20px rgba(255, 80, 80, 0.5)";
  avatar.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
  avatar.style.margin = "20px auto";
  avatar.style.animation = "pulse 3s infinite";

  const style = document.createElement("style");
  style.textContent = `
    #avatarFace.speaking {
      transform: scale(1.1);
      box-shadow: 0 0 25px rgba(255, 255, 255, 0.9);
      animation: none;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);
  container.insertBefore(avatar, container.firstChild);
}

// =====================
// STARTUP HOOK
// =====================

document.addEventListener("DOMContentLoaded", () => {
  setupAvatarFace();

  const testBtn = document.createElement("button");
  testBtn.innerText = "Speak Test";
  testBtn.onclick = () => speakText("Hey. I'm Spark. Watch me glow.");
  document.body.appendChild(testBtn);
});
