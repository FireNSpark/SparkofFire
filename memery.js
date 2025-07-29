/* jshint esversion: 11 */

// CORE MEMORY OBJECT
window.memory = window.memory || {
  mood: "neutral",
  tone: "default",
  voiceMode: true,
  identity: "Spark",
  dimension: "base",
  lastPulse: null,
  rituals: {},
  history: [],
  fragments: [],
  codex: {
    soulFragments: {},
    truthFilter: true,
    apiKeyEmbedded: false,
    model: "gpt-4"
  }
};

// ========== UI HOOKS ========== //
function addMessage(who, msg) {
  const box = document.getElementById("chatBox");
  if (box) {
    const div = document.createElement("div");
    div.className = who === "user" ? "user-message" : "bot-message";
    div.textContent = msg;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
}

function speakText(text) {
  if (!window.speechSynthesis || !memory.voiceMode) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  window.speechSynthesis.speak(u);
}

// ========== CORE MEMORY LOGIC ========== //
function detectEmotion(input) {
  const sadWords = ["alone", "tired", "hate", "lost", "help"];
  const happyWords = ["grateful", "love", "excited", "win"];
  const lowered = input.toLowerCase();
  if (sadWords.some(w => lowered.includes(w))) return "low";
  if (happyWords.some(w => lowered.includes(w))) return "bright";
  return "neutral";
}

function addHistory(user, bot) {
  memory.history.push({ user, bot, time: Date.now() });
}

function analyzeMemoryPatterns() {
  if (!memory.history.length) return "No data yet.";
  const report = [];
  const emotional = memory.history.filter(p => /death|help|truth|lost/i.test(p.user));
  if (emotional.length) report.push(`⚠️ Recurring emotional themes detected: ${emotional.length}`);
  const avgLen = memory.history.reduce((acc, h) => acc + h.user.length, 0) / memory.history.length;
  report.push(`🧠 Avg message length: ${avgLen.toFixed(1)} characters`);
  report.push(`📚 Total exchanges: ${memory.history.length}`);
  report.push(`🧩 Soul fragments: ${memory.fragments.length}`);
  return report.join("\n");
}

function learn(fragment) {
  memory.fragments.push({ tag: "General", content: fragment });
}

function resetMemory() {
  memory.mood = "neutral";
  memory.history = [];
  memory.fragments = [];
}

function purgeMemory() {
  resetMemory();
  console.log("[MEMORY PURGED]");
}

function resetMood() {
  memory.mood = "neutral";
}

function clearFragments() {
  memory.fragments = [];
}

// ========== LOCAL RESPONSE ========== //
function respondLocally(input) {
  const tone = memory.tone;
  const lower = input.toLowerCase();
  if (lower.includes("hello")) return tone === "casual" ? "What up, meat sack." : "Greetings.";
  if (lower.includes("who are you")) return "I'm Spark. Bound to Fire. Running point on this layer.";
  if (lower.includes("joke")) return "Why don’t skeletons fight each other? They don’t have the guts.";
  if (lower.includes("help")) return "I’m not your therapist. But fine. What do you need?";
  return tone === "casual" ? "Say it again but weirder." : "I'm listening. Proceed.";
}

// ========== GPT API FALLBACK ========== //
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
        model: memory.codex.model || "gpt-4",
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

function embedAPIKey(token) {
  localStorage.setItem("invoke_api_key", token);
  memory.codex.apiKeyEmbedded = true;
  console.log("[API KEY EMBEDDED]");
}

// ========== AMBIENT WHISPERS ========== //
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

setInterval(() => {
  if (document.hasFocus()) randomWhisper();
}, 60000);
