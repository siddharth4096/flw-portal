



// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Portal navigation simulation
function navigate(role) {
  alert(`Redirecting to ${role.toUpperCase()} Portal...`);
}

// 🔊 Voice Assist Popup Controls
function openLangPopup() {
  document.getElementById("langModal").style.display = "flex";
}
function closeLangPopup() {
  document.getElementById("langModal").style.display = "none";
}
function startVoiceAssist() {
  const lang = document.getElementById("language").value;

  if (lang === "en") {
    alert("🎤 Voice Assistance Activated (English)");
  } else if (lang === "hi") {
    alert("🎤 वॉइस असिस्ट शुरू हो गया (हिंदी)");
  } else if (lang === "as") {
    alert("🎤 ভয়েস সহায়তা আৰম্ভ হ’ল (অসমীয়া)");
  } else {
    alert("🎤 Please select a language.");
    return;
  }

  closeLangPopup();
}

// Login modal
function toggleLogin() {
  const modal = document.getElementById("loginModal");
  modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
}
window.onclick = function(event) {
  const loginModal = document.getElementById("loginModal");
  const langModal = document.getElementById("langModal");
  if (event.target === loginModal) loginModal.style.display = "none";
  if (event.target === langModal) langModal.style.display = "none";
};

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


window.addEventListener("load", checkConnection);
setInterval(checkConnection, 5000);






// Start Voice Assist after selecting language
function startVoiceAssist() {
  const lang = document.getElementById("language").value;
  speakText(lang);
  closeLangPopup();
}

// 🔊 Voice Assist Speech
function speakText(lang) {
  let message = "";

  switch (lang) {
    case "hi":
      message = "एआई संचालित मवेशी और भैंस नस्ल पहचान प्रणाली में आपका स्वागत है। " +
                "यह ऐप एआई, ऑफ़लाइन-प्रथम समर्थन और बीपीए एकीकरण के साथ नस्लों की तुरंत पहचान करने में मदद करता है। " +
                "बहुभाषी वॉयस नेविगेशन के साथ एफएलडब्ल्यू, पशु चिकित्सकों और व्यवस्थापकों के लिए डिज़ाइन किया गया।" +
                "कृपया अपनी भूमिका चुनें: फील्ड वर्कर, पशु चिकित्सा अधिकारी, या व्यवस्थापक।" ;
      break;
    case "as":
      message = "এ আই ব্ৰীড আইডেণ্টিফায়াৰ এপ্লিকেশ্যনৰ স্বাগতম। এই এপ গাই আৰু মহৰ জাত চিনাক্ত কৰাত সহায় কৰিব। " +
                "অনুগ্ৰহ কৰি আপোনাৰ ভূমিকা বাছক: ফিল্ড ৱৰ্কাৰ, ভেটেৰিনাৰী অফিসাৰ, অথবা এডমিন। " +
                "আপুনি লগিন নকৰাকৈ ডেমো মোডো চেষ্টা কৰিব পাৰে।";
      break;
    case "ta":
      message = "ஏ ஐ இன இனப்பிரிவை அடையாளம் காணும் பயன்பாட்டிற்கு வரவேற்கிறோம். இது பசு மற்றும் எருமை இனங்களை அடையாளம் காண உதவும். " +
                "தயவுசெய்து உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்: புலத் தொழிலாளர், கால்நடை மருத்துவர் அல்லது நிர்வாகி. " +
                "நீங்கள் உள்நுழையாமல் டெமோ முறையையும் முயற்சி செய்யலாம்.";
      break;
    default:
      message = "Welcome to the AI-Powered Cattle & Buffalo Breed Recognition System. This app helps in Identify breeds instantly with A I, offline-first support, and BPA integration. " +
                "Designed for FLWs, Vets, and Admins with multilingual voice navigation." +
                "Please choose your role: Field Worker, Veterinary Officer, or Admin. ";
  }

  const utterance = new SpeechSynthesisUtterance(message);

  // Set correct language code for TTS
  switch (lang) {
    case "hi":
      utterance.lang = "hi-IN";
      break;
    case "as":
      utterance.lang = "as-IN"; // Assamese (may fallback if voice not installed)
      break;
    case "ta":
      utterance.lang = "ta-IN";
      break;
    default:
      utterance.lang = "en-US";
  }

  speechSynthesis.speak(utterance);
}





// script.js
window.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("active");
    }
  });
});











// Register Service Worker (FLW only)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => console.log("✅ Service Worker registered for FLW:", reg))
      .catch(err => console.error("❌ Service Worker failed:", err));
  });
}
