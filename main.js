/* jshint esversion: 11 */
/* global SpeechSynthesisUtterance */

// main.js - Live assistant logic

import { memory, respondLocally, addHistory } from './memery.js';

const chatBox = document.getElementById('chatBox');
const inputField = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener("click", () => {
  const input = inputField.value;
  if (!input) return;
  addMessage("user", input);
  inputField.value = "";

  const reply = respondLocally(input);
  addMessage("bot", reply);
  speakText(reply);
  addHistory(input, reply);
});

function addMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-message" : "bot-message";
  msgDiv.innerText = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function speakText(text) {
  if (!memory.voiceMode) return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  synth.speak(utterance);
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

// Optional: pulse every 60s if idle
setInterval(() => {
  if (!document.hasFocus()) return;
  randomWhisper();
}, 60000);
