function setupAvatarFace() {
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

function speakText(text) {
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
