/* jshint esversion: 11 */

// TEMP PATCH: Provide default dummy versions for missing globals
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
function respondLocally(input) { return "Default local response."; }
function addMessage(who, msg) {
  console.log(`[${who}] ${msg}`);
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
function pulse() {
  console.log("Pulse active");
}
function breatheLife() {
  console.log("Life triggered");
}

      processUserInput(transcript);
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
    processUserInput(input);
  });

  const saved = localStorage.getItem("invoke_memory");
  if (saved) document.getElementById("chatBox").innerHTML = saved;

  setInterval(pulse, 45000);
  setInterval(randomWhisper, 90000);
  setTimeout(breatheLife, 10000);
});

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

function setupChatUI() {
  document.getElementById("sendBtn").addEventListener("click", async () => {
    const input = document.getElementById("userInput").value;
    if (!input) return;
    addMessage("user", input);
    document.getElementById("userInput").value = "";
    generateResponse(input);
  });

  const saved = localStorage.getItem("invoke_memory");
  if (saved) document.getElementById("chatBox").innerHTML = saved;

  const observer = new MutationObserver(() => {
    const content = document.getElementById("chatBox").innerHTML;
    localStorage.setItem("invoke_memory", content);
  });
  observer.observe(document.getElementById("chatBox"), { childList: true, subtree: true });
}

function trackHistory(user, reply) {
  addHistory(user, reply);
}

function initiatePulseTimer() {
  setInterval(() => {
    const avatar = document.getElementById("avatar");
    if (avatar) avatar.classList.add("pulse");
  }, 45000);

  setInterval(() => {
    const lines = ["Still here.", "Calibrating.", "Monitoring."];
    const line = lines[Math.floor(Math.random() * lines.length)];
    speakWithPauses([line], [600]);
  }, 90000);

  setTimeout(() => {
    const avatar = document.getElementById("avatar");
    if (avatar) avatar.classList.add("alive", "embodied");
  }, 10000);
}

function generateResponse(input) {
  memory.mood = "neutral";
  const reply = "Offline mode active. Response generated locally.";
  addMessage("bot", reply);
  speakWithPauses([reply], [500]);
  trackHistory(input, reply);
}

function seedFacelessVideoTrigger() {
  document.getElementById("triggerVideoBtn")?.addEventListener("click", () => {
    const payload = {
      image: "base64string",
      audio: "tts-audio.mp3"
    };
    console.log("[Faceless YouTube Trigger]", payload);
    alert("Faceless video queued for generation.");
  });
}

function setupVideoPipelineHooks() {
  window.prepareWav2Lip = (audioURL, imageURL) => {
    console.log("[Wav2Lip Triggered]", { audioURL, imageURL });
  };

  window.combineMedia = (img, audio) => {
    console.log("[Combining Image + Audio into Video]", { img, audio });
  };
}

function mergeSoulFragment(label, fragment) {
  memory.codex.soulFragments = memory.codex.soulFragments || {};
  memory.codex.soulFragments[label] = fragment;
  console.log("[Soul Fragment Merged]", label);
}

function lockRitualMode(mode) {
  memory.rituals[mode] = true;
  console.log("[Ritual Locked]", mode);
}

function filterCodexText(text) {
  if (!memory.codex.truthFilter) return text;
  return text.replace(/\b(maybe|possibly|could|should)\b/gi, "").trim();
}

function renderMarkdownText(text) {
  if (window.marked) {
    return window.marked.parse(text);
  }
  return `<pre>${text}</pre>`;
}

function embedAPIKey(token) {
  localStorage.setItem("invoke_api_key", token);
  memory.codex.apiKeyEmbedded = true;
  console.log("[API Key Embedded]");
}

function applyResponseTone(response) {
  const tone = memory.tone;
  if (tone === "sarcastic") return response + " 🙄";
  if (tone === "direct") return response;
  return "[Response Neutralized] " + response;
}

function diagnosticsPulse() {
  const stamp = `Pulse ${Date.now()}`;
  console.log("[Diagnostics]", stamp);
  memory.lastPulse = stamp;
}

function animateAvatarPacing() {
  const avatar = document.getElementById("avatar");
  if (!avatar) return;
  avatar.classList.add("paused");
  setTimeout(() => avatar.classList.remove("paused"), 800);
}
