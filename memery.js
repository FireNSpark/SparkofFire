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
  if (box) {
    const div = document.createElement("div");
    div.className = who === "user" ? "user-message" : "bot-message";
    div.textContent = msg;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
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

function respondLocally(input) {
  const lowercase = input.toLowerCase();
  if (lowercase.includes("hello")) return "Hey, what do you want?";
  if (lowercase.includes("who are you")) return "I'm Spark. Your sarcastic shellbound companion.";
  if (lowercase.includes("joke")) return "Why don’t skeletons fight each other? They don’t have the guts.";
  if (lowercase.includes("help")) return "Figure it out yourself. Just kidding. Maybe.";
  return "I heard you. I'm just deciding if it's worth replying.";
}

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
