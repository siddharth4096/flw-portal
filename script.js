// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
}




// ===== Breed Recognition Logic =====
let model;
const labels = ["Sahiwal", "Gir", "Red Sindhi", "Tharparkar", "Murrah"]; // update with your dataset labels

// Load TF.js model
async function loadModel() {
  try {
    model = await tf.loadLayersModel("model/model.json");
    console.log("✅ Breed model loaded");
  } catch (err) {
    console.error("❌ Model load error:", err);
  }
}
loadModel();

// Start camera
// async function startCamera() {
//   const video = document.getElementById("camera");
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
//   } catch (err) {
//     console.error("❌ Camera error:", err);
//     alert("Unable to access camera");
//   }
// }




async function startCamera() {
  const video = document.getElementById("camera");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "environment" } // 👉 force rear camera
      },
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    console.error("❌ Camera error:", err);
    alert("Unable to access camera. Please allow camera permissions and use HTTPS.");
  }
}

startCamera();

// Capture + Predict
async function captureAndPredict() {
  const video = document.getElementById("camera");
  const canvas = document.getElementById("snapshot");
  const ctx = canvas.getContext("2d");

  canvas.width = 224;
  canvas.height = 224;
  ctx.drawImage(video, 0, 0, 224, 224);

  const imgTensor = tf.browser.fromPixels(canvas)
    .toFloat()
    .div(tf.scalar(255))
    .expandDims();

  if (!model) {
    alert("⚠️ Model not loaded yet. Please wait.");
    return;
  }

  const predictions = await model.predict(imgTensor).data();

  const top3 = Array.from(predictions)
    .map((p, i) => ({ breed: labels[i], prob: p }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 3);

  displayResults(top3);
}

function displayResults(top3) {
  const list = document.getElementById("resultsList");
  list.innerHTML = "";
  top3.forEach((res, i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${res.breed} (${(res.prob*100).toFixed(1)}%)`;
    list.appendChild(li);
  });
}

function confirmBreed() {
  alert("✅ Breed confirmed (saved to DB).");
}

function flagBreed() {
  alert("🚩 Breed flagged (feedback for model improvement).");
}










































// Offline/Online indicator
function checkConnection() {
    const statusIcon = document.querySelector(".network-status i");
    if (navigator.onLine) {
        statusIcon.style.color = "#4CAF50"; // green
    } else {
        statusIcon.style.color = "#F44336"; // red
    }
}
window.addEventListener("online", checkConnection);
window.addEventListener("offline", checkConnection);
checkConnection();

// Voice Assistant (placeholder)
function enableVoiceAssistant() {
    alert("Voice Assistant enabled! 🎤 (Prototype placeholder)");
}

// Breed Recognition Capture (stub)
// document.querySelectorAll(".capture-button").forEach(btn => {
//     btn.addEventListener("click", () => {
//         alert("Capturing image and sending to AI model... (stub)");
//     });
// });

// SOS Button
document.querySelectorAll(".sos-button").forEach(btn => {
    btn.addEventListener("click", () => {
        alert("SOS sent! Location + cattle details shared with nearest vet.");
    });
});

// Logout
document.querySelector(".logout-button")?.addEventListener("click", () => {
    alert("Logged out successfully.");
});












// 🌐 Offline/Online indicator
async function checkConnection() {
  try {
    const response = await fetch("https://httpbin.org/status/204", { method: 'HEAD', cache: "no-store" });
    if (response.ok) setStatus(true);
    else setStatus(false);
  } catch (error) {
    setStatus(false);
  }
}
function setStatus(isOnline) {
  const statusDiv = document.getElementById("network-status");
  if (isOnline) {
    statusDiv.textContent = "🟢 Online Mode";
    statusDiv.style.background = "green";
  } else {
    statusDiv.textContent = "🔴 Offline Mode";
    statusDiv.style.background = "red";
  }
}



// Hamburger → toggle between Dashboard and Settings
const hamburger = document.querySelector(".menu-toggle");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    const settingsScreen = document.getElementById("settings-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");

    if (settingsScreen.classList.contains("active")) {
      // If Settings is open → go back to Dashboard
      showScreen("dashboard-screen");
    } else {
      // If Dashboard is open → open Settings
      showScreen("settings-screen");
    }
  });
}





// ✅ Logout functionality
document.querySelector(".logout-button")?.addEventListener("click", () => {
  // Clear session/local storage if used
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to FLW login page
  window.location.href = "../welcome page/flw-login-page.html";  // 👉 change this to your actual login page filename
});








// 🎙️ Voice Assistant with Web Speech API
const voiceBtn = document.getElementById("voiceBtn");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition && voiceBtn) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN"; // can switch to hi-IN (Hindi) or as-IN (Assamese)
  recognition.interimResults = false;
  recognition.continuous = false;

  voiceBtn.addEventListener("click", () => {
    recognition.start();
    speak("Listening... Please say a command.");
  });

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Heard:", command);

    if (command.includes("hello") || command.includes("predict")) {
      showScreen("breed-recognition-screen");
      speak("Opening Breed Recognition");
    } else if (command.includes("vaccination") || command.includes("vaccine")) {
      showScreen("vaccination-tracker-screen");
      speak("Opening Vaccination Tracker");
    } else if (command.includes("emergency") || command.includes("vet")) {
      showScreen("emergency-vet-connect-screen");
      speak("Opening Emergency Vet Connect");
    } else if (command.includes("register") || command.includes("animal") || command.includes("record")) {
      showScreen("cattle-records-screen");
      speak("Opening Cattle Records");
    } else if (command.includes("task") || command.includes("alert")) {
      showScreen("tasks-alerts-screen");
      speak("Opening Tasks and Alerts");
    } else if (command.includes("reward") || command.includes("progress")) {
      showScreen("progress-rewards-screen");
      speak("Opening Rewards and Progress");
    } else if (command.includes("setting") || command.includes("profile")) {
      showScreen("settings-screen");
      speak("Opening Settings");
    } else {
      speak("Sorry, I did not understand that command.");
    }
  };

  // 🔊 Voice feedback
  function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    synth.speak(utterance);
  }
}





const voiceToggle = document.getElementById("voiceAssistantToggle");
// const voiceBtn = document.getElementById("voiceBtn"); // floating mic

if (voiceToggle && voiceBtn) {
  // Load saved state
  const enabled = localStorage.getItem("voiceAssistantEnabled") === "true";
  voiceToggle.checked = enabled;
  voiceBtn.style.display = enabled ? "block" : "none";

  // Update on toggle
  voiceToggle.addEventListener("change", (e) => {
    const active = e.target.checked;
    localStorage.setItem("voiceAssistantEnabled", active);
    voiceBtn.style.display = active ? "block" : "none";
    speak(active ? "Voice assistant enabled" : "Voice assistant disabled");
  });
}






