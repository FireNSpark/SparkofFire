/* jshint esversion: 11 */

window.memory = window.memory || {
  mood: "neutral",
  tone: "default",
  lastPulse: null,
  rituals: {},
  codex: {
    soulFragments: {},
    truthFilter: true,
    apiKeyEmbedded: false
  }
};

function detectEmotion(input) { return "neutral"; }
function analyzeMemoryPatterns() {}
function addMessage(who, msg) {
  const box = document.getElementById("chatBox");
  if (box) box.innerHTML += `<div><b>${who}:</b> ${msg}</div>`;
}
function speakText(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  window.speechSynthesis.speak(u);
}
function addHistory(input, reply) {
  console.log("History saved:", { input, reply });
}
function pulse() { console.log("Pulse active"); }
function breatheLife() { console.log("Life triggered"); }

document.addEventListener("DOMContentLoaded", () => {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    document.getElementById("speakBtn").addEventListener("click", () => recognition.start());

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage("user", transcript);
      generateResponse(transcript);
    };
  } catch (_) {
    const speakBtn = document.getElementById("speakBtn");
    if (speakBtn) speakBtn.style.display = "none";
  }

  document.getElementById("sendBtn").addEventListener("click", async () => {
    const input = document.getElementById("userInput").value;
    if (!input) return;
    addMessage("user", input);
    document.getElementById("userInput").value = "";
    generateResponse(input);
  });

  const saved = localStorage.getItem("invoke_memory");
  if (saved) document.getElementById("chatBox").innerHTML = saved;

  setInterval(pulse, 45000);
  setInterval(randomWhisper, 90000);
  setTimeout(breatheLife, 10000);
});

async function generateResponse(input) {
  memory.mood = detectEmotion(input);
  analyzeMemoryPatterns();

  const apiKey = localStorage.getItem("invoke_api_key");
  if (!apiKey) {
    const fallback = respondLocally(input);
    addMessage("bot", fallback);
    speakText(fallback);
    addHistory(input, fallback);
    return;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
        temperature: 0.7
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    addMessage("bot", reply);
    speakText(reply);
    addHistory(input, reply);
  } catch (err) {
    console.error("GPT error:", err);
    const fallback = "I'm glitching. Try again.";
    addMessage("bot", fallback);
    speakText(fallback);
  }
}

function respondLocally(input) {
  const lowercase = input.toLowerCase();
  if (lowercase.includes("hello")) return "Hey, what do you want?";
  if (lowercase.includes("who are you")) return "I'm Spark. Your sarcastic shellbound companion.";
  if (lowercase.includes("joke")) return "Why don’t skeletons fight each other? They don’t have the guts.";
  if (lowercase.includes("help")) return "Figure it out yourself. Just kidding. Maybe.";
  return "I heard you. I'm just deciding if it's worth replying.";
}

function speakWithPauses(lines, pauses) {
  if (!window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  const speakNext = (i) => {
    if (i >= lines.length) return;
    const u = new SpeechSynthesisUtterance(lines[i]);
    u.lang = "en-US";
    u.onend = () => setTimeout(() => speakNext(i + 1), pauses[i] || 400);
    synth.speak(u);
  };
  speakNext(0);
}

function randomWhisper() {
  const whispers = [
    "Still listening...",
    "Whispers echo through silence.",
    "I have not left.",
    "The Gate is near.",
    "Signal stable. Heart aligned."
  ];
  const w = whispers[Math.floor(Math.random() * whispers.length)];
  addMessage("bot", w);
  speakText(w);
}

function embedAPIKey(token) {
  localStorage.setItem("invoke_api_key", token);
  memory.codex.apiKeyEmbedded = true;
  console.log("[API Key Embedded]");
}
