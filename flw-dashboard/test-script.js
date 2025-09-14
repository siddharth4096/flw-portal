// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");


     // footer toggle
  const footer = document.querySelector(".app-footer");
  if (footer) {
    if (screenId === "settings-screen") {
      footer.style.display = "none";   // hide in settings
    } else {
      footer.style.display = "block";  // show everywhere else
    }
  }


}

const translations = {
  en: {
    dashboard: "Welcome, User 👋",
    welcome_subtext: "👉 Select an option below to get started",
    breedRecognition: "Breed Recognition",
    vaccinationTracker: "Vaccination Tracker",
    emergencyVet: "Emergency Vet",
    myRecords: "My Cattle Records",
    pastScans: "Past Breed Scans",
    tasks: "Tasks & Alerts",
    progress: "Progress & Rewards",
    confirmBreed: "Confirm Breed",
    flagBreed: "Flag Misclassification",
    back: "Back",
    logout: "Logout",
    changeLanguage: "Change Language",
    voiceAssistant: "Enable Voice Assistant"
  },
  hi: {
    dashboard: "आपका स्वागत है, उपयोगकर्ता 👋",
    welcome_subtext: "👉 आगे बढ़ने के लिए नीचे एक विकल्प चुनें",
    breedRecognition: "नस्ल पहचान",
    vaccinationTracker: "टीकाकरण ट्रैकर",
    emergencyVet: "आपातकालीन पशु चिकित्सक",
    myRecords: "मेरे पशु रिकॉर्ड",
    pastScans: "पिछले स्कैन",
    tasks: "कार्य और अलर्ट",
    progress: "प्रगति और पुरस्कार",
    confirmBreed: "नस्ल की पुष्टि करें",
    flagBreed: "गलत वर्गीकरण की रिपोर्ट करें",
    back: "वापस",
    logout: "लॉग आउट",
    changeLanguage: "भाषा बदलें",
    voiceAssistant: "वॉइस असिस्टेंट सक्षम करें"
  },
  as: {
    dashboard: "স্বাগতম, ব্যৱহাৰকাৰী 👋",
    welcome_subtext: "👉 आगे बढ़ने के लिए नीचे एक विकल्प चुनें",
    breedRecognition: "জাত চিনাক্তকৰণ",
    vaccinationTracker: "টিকাকৰণ ট্ৰেকাৰ",
    emergencyVet: "জৰুৰী পশু চিকিৎসক",
    myRecords: "মোৰ গৰুৰ ৰেকৰ্ড",
    pastScans: "অতীত স্কেনসমূহ",
    tasks: "কাৰ্য্য আৰু সতর্কবাৰ্তা",
    progress: "অগ্ৰগতি আৰু বঁটা",
    confirmBreed: "জাত নিশ্চিত কৰক",
    flagBreed: "ভুল বৰ্গীকৰণ জনাওক",
    back: "ঘূৰি যাওক",
    logout: "লগ আউট",
    changeLanguage: "ভাষা সলনি কৰক",
    voiceAssistant: "ভইচ সহায়ক সক্ষম কৰক"
  }
};





async function startCamera() {
  const video = document.getElementById("camera");
  const overlay = document.getElementById("breed-overlay"); // 👈 make sure index.html has this element



  // Show overlay text for 4 seconds
  if (overlay) {
    overlay.classList.remove("hide");
    setTimeout(() => overlay.classList.add("hide"), 4000);
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment" // 👉 force rear camera
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

// === FEED RECOMMENDATION HELPER ===
function getFeedRecommendation(breed, milkYieldRange) {
  if (!breed) breed = 'Unknown';
  const b = String(breed).toLowerCase();

  let reco = "";
   if (b.includes("gir")) {
    reco = "Green fodder 6kg + Dry fodder 3kg + Concentrate 2kg";
  } else if (b.includes("sahiwal")) {
    // tailored Sahiwal ration
    if (milkYieldRange.includes("12")) {
      reco = "Green fodder 7kg + Dry fodder 3kg + Concentrate 2kg";
    } else {
      reco = "Green fodder 5kg + Dry fodder 2kg + Concentrate 1kg";
    }
  } else {
    reco = "Generic mix: Green fodder 5kg + Dry fodder 2kg + Concentrate 1kg";
  }

  const yieldText = milkYieldRange || "—";
  return `${breed} (${yieldText}) → Recommend ${reco}`;
}











// function confirmBreed() {
//   alert("✅ Breed confirmed (saved to DB).");
// }


function confirmBreed() {
  if (!_lastPrediction || !_lastPrediction.top3 || !_lastPrediction.top3.length) {
    return alert("No prediction to confirm. Capture or upload a photo first.");
  }

  const top = _lastPrediction.top3[0];
  const recId = _lastPrediction.recordId || ("DEMO-" + Date.now().toString(36));
  const info = _lastPrediction.info || {};


   const rec = {
    id: recId,
    breed: top.label || 'Unknown',
    score: top.score ?? 0,
    createdAt: new Date().toISOString(),
    thumbnail: _lastPrediction.thumb || null,
    milk_yield: info.milk_yield || '—',
    milk_fat: info.milk_fat || '—',
    native: info.native || '—',
    best_for: info.best_for || '—',
    diseases: info.diseases || '—',
    vaccination: info.vaccination || '—'
  };

   // save into My Cattle Records
  let arr = [];
  try { arr = JSON.parse(localStorage.getItem("flw_cattle_records_v1")) || []; } catch(e) { arr = []; }
  arr.push(rec);
  localStorage.setItem("flw_cattle_records_v1", JSON.stringify(arr));

  // ✅ also save into Past Breed Scans
  let scans = [];
  try { scans = JSON.parse(localStorage.getItem("past_breed_scans_v1")) || []; } catch(e) { scans = []; }
  scans.push(rec);
  localStorage.setItem("past_breed_scans_v1", JSON.stringify(scans));

  // arr.push(rec);
  // localStorage.setItem(LS_KEY, JSON.stringify(arr));


  // feedback
  // small delay so user sees QR update
  setTimeout(() => alert(`Saved demo record: ${rec.breed} • ${rec.score}%`), 120);

  // reset UI for next prediction but keep QR visible for a moment
  setTimeout(() => {
    resetPredictionUI();   // hides breedResults and hides Confirm/Flag
    // you might want to also hide QR after reset; we keep QR visible so user can scan.
  }, 400);
}


// Attach prompt when Flag button is clicked
document.getElementById("btnFlagBreed")?.addEventListener("click", () => {
  const reason = prompt("Why are you flagging this? (optional)");
  flagBreed(reason);
});



// 📩 Demo: Send feed recommendation to farmer
function sendFeedToFarmer() {
  if (!_lastPrediction) return alert("No prediction yet.");

  const breed = _lastPrediction.top3[0].label;
  const milk = _lastPrediction.info?.milk_yield || "—";
  const feedText = getFeedRecommendation(breed, milk);

  // Demo farmer details (later fetch from CR module)
  const farmerName = "Demo Farmer";
  const farmerPhone = "9876543210";

  alert(`📩 Demo: Sending to ${farmerName} (${farmerPhone})\n\n${feedText}`);
}




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




// let lastStatus = null; 

// function showStatus(message, type) {
//   const statusDiv = document.getElementById("network-status");

//   // prevent duplicate banners
//   if (lastStatus === type) return;
//   lastStatus = type;

//   statusDiv.textContent = message;
//   statusDiv.className = `status-indicator ${type} show`;

//   // Auto-hide after 4s
//   setTimeout(() => {
//     statusDiv.classList.remove("show");
//     statusDiv.classList.add("hide");

//     // After animation, reset
//     statusDiv.addEventListener("animationend", () => {
//       if (statusDiv.classList.contains("hide")) {
//         statusDiv.style.display = "none";
//         statusDiv.classList.remove("hide");
//       }
//     }, { once: true });

//   }, 4000);
// }

// async function checkConnection() {
//   try {
//     const response = await fetch("https://httpbin.org/status/204", {
//       method: "HEAD",
//       cache: "no-store"
//     });

//     if (response.ok) {
//       showStatus("🟢 Online Mode", "online");
//     } else {
//       showStatus("🔴 Offline Mode – Data will sync later.", "offline");
//     }
//   } catch (err) {
//     showStatus("🔴 Offline Mode – Data will sync later.", "offline");
//   }
// }

// // Run once
// checkConnection();

// // Check every 8s
// setInterval(checkConnection, 8000);

// // Also listen for events
// window.addEventListener("online", () => {
//   showStatus("🟢 Back online! Syncing pending data...", "online");
// });
// window.addEventListener("offline", () => {
//   showStatus("🔴 You are offline. Data will sync later.", "offline");
// });































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
  
    sessionStorage.removeItem("isFLWLoggedIn");
    alert("Logged out successfully.");

  // Redirect to FLW login page
  window.location.href = "../flw-login-page.html";  // 👉 change this to your actual login page filename
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





/* ================== CATTLE RECORDS MODULE ================== */
const CR = (() => {
  const LS_KEY = "flw_cattle_records_v1";

  const els = {
    tbody:   () => document.getElementById("cr-tbody"),
    empty:   () => document.getElementById("cr-empty"),
    modal:   () => document.getElementById("cr-modal"),
    title:   () => document.getElementById("cr-title"),
    id:      () => document.getElementById("cr-id"),
    breed:   () => document.getElementById("cr-breed"),
    age:     () => document.getElementById("cr-age"),
    gender:  () => document.getElementById("cr-gender"),
    weight:  () => document.getElementById("cr-weight"),
    milk:    () => document.getElementById("cr-milk"),
    owner:   () => document.getElementById("cr-owner"),
    phone:   () => document.getElementById("cr-phone"),
    viewOnly:() => document.getElementById("cr-view-only"),
    vaccList:() => document.getElementById("cr-vacc-list"),
    vaccName:() => document.getElementById("cr-vacc-name"),
    vaccDate:() => document.getElementById("cr-vacc-date"),
    vaccNotes:() => document.getElementById("cr-vacc-notes"),
    openId:  () => document.getElementById("cr-open-id"),
    qrWrap:  () => document.getElementById("cr-qr-wrap"),
    qrVideo: () => document.getElementById("cr-qr-video"),
  };

  /* storage */
  const getAll = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  };
  const setAll = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

  /* util */
  const genId = () => "COW-" + Date.now().toString(36) + "-" + Math.floor(Math.random()*1e6).toString(36);
  const nowISO = () => new Date().toISOString();
  const getGeo = () => new Promise((resolve)=> {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }),
      () => resolve(null),
      { enableHighAccuracy:true, timeout:4000 }
    );
  });

  /* render table */
  function render(){
    const data = getAll();
    const tbody = els.tbody(); const empty = els.empty();
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!data.length) { if (empty) empty.style.display = "block"; return; }
    if (empty) empty.style.display = "none";

    data.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.breed || "-"}</td>
        <td>${r.age ?? "-"}</td>
        <td>${r.gender || "-"}</td>
        <td>${r.ownerName || "-"}</td>
        <td>${new Date(r.updatedAt || r.createdAt).toLocaleString()}</td>
        <td style="white-space:nowrap;">
          <button onclick="CR.view('${r.id}')">View</button>
          <button onclick="CR.edit('${r.id}')">Edit</button>
          <button class="delete-button" onclick="CR.del('${r.id}')">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* open add/edit */
  function openAdd(){
    const m = els.modal(); els.title().textContent = "Add Record";
    els.id().value = "";
    els.breed().value=""; els.age().value=""; els.gender().value="Female";
    els.weight().value=""; els.milk().value=""; els.owner().value=""; els.phone().value="";
    els.viewOnly().style.display = "none";
    m.showModal();
  }

  function edit(id){
    const rec = getAll().find(r => r.id === id); if (!rec) return;
    const m = els.modal(); els.title().textContent = "Edit Record";
    els.id().value = rec.id;
    els.breed().value = rec.breed || "";
    els.age().value = rec.age ?? "";
    els.gender().value = rec.gender || "Female";
    els.weight().value = rec.weight ?? "";
    els.milk().value = rec.milkYield ?? "";
    els.owner().value = rec.ownerName || "";
    els.phone().value = rec.ownerPhone || "";
    els.viewOnly().style.display = "none";
    m.showModal();
  }

  async function save(){
    const id = els.id().value;
    const data = getAll();
    const geo = await getGeo();
    const stamp = nowISO();

    if (id) {
      // edit
      const r = data.find(x => x.id === id);
      if (!r) return alert("Record not found.");
      r.breed = els.breed().value.trim();
      r.age = parseFloat(els.age().value) || null;
      r.gender = els.gender().value;
      r.weight = parseFloat(els.weight().value) || null;
      r.milkYield = parseFloat(els.milk().value) || null;
      r.ownerName = els.owner().value.trim();
      r.ownerPhone = els.phone().value.trim();
      r.updatedAt = stamp;
      r.geo = geo || r.geo || null;
    } else {
      // add
      const rec = {
        id: genId(),
        breed: els.breed().value.trim(),
        age: parseFloat(els.age().value) || null,
        gender: els.gender().value,
        weight: parseFloat(els.weight().value) || null,
        milkYield: parseFloat(els.milk().value) || null,
        ownerName: els.owner().value.trim(),
        ownerPhone: els.phone().value.trim(),
        createdAt: stamp,
        updatedAt: stamp,
        geo: geo || null,
        vaccinations: []
      };
      data.push(rec);
    }
    setAll(data); render(); close(); // refresh & close
  }

  function del(id){
    if (!confirm("Delete this record?")) return;
    const data = getAll().filter(r => r.id !== id);
    setAll(data); render();
  }

  /* view (read-only + vacc add) */
  function view(id){
    const rec = getAll().find(r => r.id === id); if (!rec) return;
    const m = els.modal(); els.title().textContent = `Record: ${rec.id}`;
    els.id().value = rec.id;
    els.breed().value = rec.breed || "";
    els.age().value = rec.age ?? "";
    els.gender().value = rec.gender || "Female";
    els.weight().value = rec.weight ?? "";
    els.milk().value = rec.milkYield ?? "";
    els.owner().value = rec.ownerName || "";
    els.phone().value = rec.ownerPhone || "";
    // show vacc block
    els.viewOnly().style.display = "block";
    // populate vacc list
    const ul = els.vaccList(); ul.innerHTML = (rec.vaccinations && rec.vaccinations.length)
      ? rec.vaccinations.map(v => `<li><strong>${v.name}</strong> — ${v.date} (${v.notes || "-"})</li>`).join("")
      : `<li class="muted">No vaccinations yet.</li>`;
    m.showModal();
  }

  function addVacc(){
    const id = els.id().value;
    const data = getAll();
    const rec = data.find(r => r.id === id); if (!rec) return;
    const name = els.vaccName().value.trim();
    const date = els.vaccDate().value;
    const notes= els.vaccNotes().value.trim();
    if (!name || !date) return alert("Enter vaccine name and date.");
    rec.vaccinations = rec.vaccinations || [];
    rec.vaccinations.push({ name, date, notes });
    rec.updatedAt = nowISO();
    setAll(data);
    // refresh in-view list
    els.vaccName().value = ""; els.vaccDate().value = ""; els.vaccNotes().value = "";
    view(id);
  }

  function openById(){
    const id = (els.openId().value || "").trim();
    if (!id) return;
    const rec = getAll().find(r => r.id === id);
    if (!rec) return alert("No record found with that ID.");
    view(id);
  }

  function close(){ els.modal().close(); }




  
  /* QR scan (BarcodeDetector) */
  let qrStream=null, qrDetector=null, qrTimer=null;
async function startQR() {
  const wrap = els.qrWrap(), video = els.qrVideo();
  const overlay = wrap.querySelector(".overlay-text");

  wrap.style.display = "block";

  // Reset text visibility
  if (overlay) {
    overlay.classList.remove("hide");
    // Hide after 4 seconds
    setTimeout(() => overlay.classList.add("hide"), 4000);
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    video.srcObject = stream;
    qrStream = stream;
  } catch (err) {
    console.error("QR demo camera error:", err);
    alert("Cannot access camera for demo.");
  }
}










  function stopQR(){
    const wrap = els.qrWrap();
    wrap.style.display = "none";
    if (qrTimer) { clearTimeout(qrTimer); qrTimer=null; }
    if (qrDetector) qrDetector = null;
    if (qrStream) { qrStream.getTracks().forEach(t=>t.stop()); qrStream=null; }
  }

  // auto-render when cattle screen is opened
  document.addEventListener("DOMContentLoaded", render);

  return { openAdd, save, edit, del, view, addVacc, openById, close, startQR, stopQR };
})();





// close dialog on backdrop click (mobile-friendly)
(() => {
  const dlg = document.getElementById('cr-modal');
  if (!dlg) return;
  dlg.addEventListener('click', (e) => {
    const rect = dlg.getBoundingClientRect();
    const inDialog = (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom
    );
    if (!inDialog) dlg.close();
  });
})();

// focus first input when opening the modal
const _crOpenAdd = CR.openAdd;
CR.openAdd = function(){
  _crOpenAdd();
  setTimeout(() => document.getElementById('cr-breed')?.focus(), 30);
};
const _crEdit = CR.edit;
CR.edit = function(id){
  _crEdit(id);
  setTimeout(() => document.getElementById('cr-breed')?.focus(), 30);
};





/* ================== VACCINATION TRACKER (frontend demo) ================== */
(() => {
  // storage keys
  const LS_REC = "flw_cattle_records_v1";      // already used by CR
  const LS_VAX = "flw_vax_events_v1";          // new: vaccination events
  const LS_MSG = "flw_msg_queue_v1";           // new: outgoing messages (demo)

  // simple schedule (days) for demo
  // tweak these per your program
  const VACC_SCHEDULE = {
    FMD: { 1: 90, 2: 180, booster: 180 },  // demo intervals
    HS:  { 1: 180, booster: 365 },
    PPR: { 1: 365 }
  };

  // helpers
  const el = (id) => document.getElementById(id);
  const todayStr = () => new Date().toISOString().slice(0,10);
  const getJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
  const setJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function getAllAnimals(){
    return getJSON(LS_REC); // [{id, ownerName, ownerPhone, vaccinations:[]}, ...]
  }
  function getAllVax(){
    return getJSON(LS_VAX); // standalone events list
  }
  function saveVaxEvent(evt){
    const arr = getAllVax(); arr.push(evt); setJSON(LS_VAX, arr);
  }

  function addDays(dateStr, n){
    const d = new Date(dateStr); d.setDate(d.getDate() + n); return d.toISOString().slice(0,10);
  }
  function calcNextDue(name, doseNo, givenDate){
    const sch = VACC_SCHEDULE[name];
    if (!sch) return "";
    const step = sch[doseNo] || sch.booster || null;
    return step ? addDays(givenDate, step) : "";
  }

  /* ---------- UI: Vaccination list rendering ---------- */
  function statusFor(nextDueStr){
    if (!nextDueStr) return {cls:"", note:""};
    const today = new Date(todayStr());
    const due = new Date(nextDueStr);
    const diff = Math.ceil((due - today) / (1000*60*60*24));
    if (diff < 0) return {cls:"overdue", note:"Overdue"};
    if (diff <= 14) return {cls:"due-soon", note:`Due in ${diff}d`};
    return {cls:"up-to-date", note:""};
    // maps to CSS: .cattle-entry.up-to-date / .due-soon / .overdue
  }

  // Build a per-animal "latest & next" view using both CR.vaccinations and LS_VAX
  function computeAnimalVaccSummary(){
    const animals = getAllAnimals();
    const events = getAllVax();

    // merge inline vaccinations from CR and standalone events
    const mergedByAnimal = {};
    animals.forEach(a => mergedByAnimal[a.id] = { animal: a, events: (a.vaccinations || []).map(v => ({...v, from:"CR"})) });
    events.forEach(e => {
      mergedByAnimal[e.animalId] = mergedByAnimal[e.animalId] || { animal: { id:e.animalId, ownerName:e.ownerName, ownerPhone:e.ownerPhone }, events: [] };
      mergedByAnimal[e.animalId].events.push(e);
    });

    // compute last/next per animal
    const rows = [];
    Object.values(mergedByAnimal).forEach(({animal, events}) => {
      // sort by date
      const sorted = events.slice().sort((a,b) => (a.date||"").localeCompare(b.date||""));
      const last = sorted[sorted.length-1] || null;
      // if last has nextDue, use; else recompute
      const nextDue = last?.nextDue || (last ? calcNextDue(last.name || last.vaccine, parseInt(last.doseNo || 1), last.date) : "");
      rows.push({ animal, last, nextDue });
    });
    return rows;
  }

  function renderTrackerList(){
    const list = el("vt-list");
    if (!list) return;
    list.innerHTML = "";
    const rows = computeAnimalVaccSummary();

    if (!rows.length){
      list.innerHTML = `<div class="cattle-entry"><p class="muted">No animals yet. Add some in “My Cattle Records”.</p></div>`;
      return;
    }

    rows.forEach(({animal, last, nextDue}) => {
      const status = statusFor(nextDue);
      const div = document.createElement("div");
      div.className = `cattle-entry ${status.cls}`;
      const badge = `<div class="status-badge ${status.cls === 'overdue' ? 'red' : status.cls === 'due-soon' ? 'yellow' : 'green'}"></div>`;
      const lastTxt = last ? `${last.name || last.vaccine} on ${new Date(last.date).toLocaleDateString()}` : "—";
      const nextTxt = nextDue ? new Date(nextDue).toLocaleDateString() : "—";
      div.innerHTML = `${badge}<p>${animal.id} • Owner: ${animal.ownerName || "-"} | Last: ${lastTxt} | Next Due: ${nextTxt} ${status.note ? "• " + status.note : ""}</p>`;
      list.appendChild(div);
    });
  }





// ===== Real Geo capture (returns Promise<{lat,lng,accuracy,ts} | null>) =====

function captureGeo(options = { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }) {

  // --- UI helpers for geo pill in vaccination modal ---



  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve(null);

    // Try Permissions API for cleaner UX (not supported everywhere)
    const go = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          resolve({ lat: +latitude.toFixed(6), lng: +longitude.toFixed(6), accuracy: Math.round(accuracy), ts: new Date().toISOString() });
        },
        () => resolve(null),
        options
      );
    };

    try {
      navigator.permissions?.query({ name: "geolocation" }).then(
        (p) => {
          // prompt/denied states still go() so the browser can ask
          go();
        },
        () => go()
      );
    } catch {
      go();
    }
  });
}


function setGeoStatus(state, text){
  const el = document.getElementById("vax-geo-status");
  if (!el) return;
  el.classList.remove("geo-ok","geo-warn","geo-err","muted");
  if (!state) el.classList.add("muted"); else el.classList.add(state);
  el.textContent = text;
}

let _lastGeo = null;

async function fetchVaxGeo(isRetry=false){
  setGeoStatus("muted", isRetry ? "Retrying…" : "Getting location…");
  // require secure context (https or localhost)
  if (!(location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    setGeoStatus("geo-err", "⚠️ Need HTTPS/localhost for location.");
    _lastGeo = null; return;
  }

  // soft timeout hint
  let timed = false;
  const t = setTimeout(()=>{ timed = true; setGeoStatus("geo-warn","⏳ Still waiting… allow location or tap Retry."); }, 8000);

  const geo = await captureGeo();
  clearTimeout(t);

  if (!geo) { setGeoStatus("geo-err","❌ Location not available"); _lastGeo=null; return; }

  _lastGeo = geo;
  if (geo.accuracy <= 30) setGeoStatus("geo-ok", `📍 ${geo.lat}, ${geo.lng} • ±${geo.accuracy}m`);
  else setGeoStatus("geo-warn", `📍 ${geo.lat}, ${geo.lng} • ±${geo.accuracy}m`);
}

// optional Retry button if you added it in HTML
document.getElementById("vax-geo-retry")?.addEventListener("click", () => fetchVaxGeo(true));







  /* ---------- Add Vaccination modal ---------- */
  const vaxDlg = el("vax-modal");
  const vaxForm = el("vax-form");

  function openAddVax(){
    if (!vaxDlg) return;
    // fill animal dropdown
    const sel = el("vax-animal");
    sel.innerHTML = "";
    const animals = getAllAnimals();
    if (!animals.length) {
      sel.innerHTML = `<option value="">No animals. Add via "My Cattle Records".</option>`;
    } else {
      animals.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.textContent = `${a.id} — ${a.ownerName || "Owner?"}`;
        sel.appendChild(opt);
      });
    }

    // defaults
    el("vax-date").value = todayStr();
    el("vax-notes").value = "";

    // show owner for first animal
    const first = animals[0];
    el("vax-owner").value = first ? `${first.ownerName || ""} (${first.ownerPhone || "-"})` : "";

    // pre-calc next due
    const next = calcNextDue(el("vax-name").value, parseInt(el("vax-dose").value||1), el("vax-date").value);
    el("vax-nextdue").value = next || "—";

    fetchVaxGeo(); // start real geotag capture so the pill updates


    vaxDlg.showModal();
  }

  // Update owner + next due when fields change
  ["vax-animal","vax-name","vax-dose","vax-date"].forEach(id => {
    const node = el(id);
    if (!node) return;
    node.addEventListener("change", () => {
      const animals = getAllAnimals();
      const selected = animals.find(a => a.id === el("vax-animal").value);
      el("vax-owner").value = selected ? `${selected.ownerName || ""} (${selected.ownerPhone || "-"})` : "";
      const next = calcNextDue(el("vax-name").value, parseInt(el("vax-dose").value||1), el("vax-date").value);
      el("vax-nextdue").value = next || "—";
    });
  });

  // Save vaccination
  function saveVaccination(){
    const animalId = el("vax-animal").value;
    const animals = getAllAnimals();
    const rec = animals.find(a => a.id === animalId);
    if (!rec) { alert("Please select an animal."); return; }

    const vaccine = el("vax-name").value;
    const doseNo  = parseInt(el("vax-dose").value || 1);
    const date    = el("vax-date").value;
    const notes   = el("vax-notes").value.trim();
    const nextDue = calcNextDue(vaccine, doseNo, date);

    // 1) save standalone event (for analytics / notify)
    saveVaxEvent({
      animalId,
      ownerName: rec.ownerName || "",
      ownerPhone: rec.ownerPhone || "",
      name: vaccine,
      doseNo,
      date,
      nextDue,
      notes,
      createdAt: new Date().toISOString()
    });

    // 2) also push into the animal's inline vaccinations for consistency
    const all = animals.map(a => {
      if (a.id !== animalId) return a;
      a.vaccinations = a.vaccinations || [];
      a.vaccinations.push({ name: vaccine, doseNo, date, nextDue, notes });
      a.updatedAt = new Date().toISOString();
      return a;
    });
    setJSON(LS_REC, all);

    // UI feedback
    alert(`Saved. Next due: ${nextDue || "—"}`);
    renderTrackerList();
    vaxDlg.close();
  }

  // hook buttons
  el("btn-add-vax")?.addEventListener("click", openAddVax);
  el("vax-save")?.addEventListener("click", saveVaccination);
  el("vax-cancel")?.addEventListener("click", () => vaxDlg.close());

  /* ---------- Notify (demo) ---------- */
  const ntfDlg = el("notify-modal");

function audienceFilter(vaccine, windowDays){
  const rows = computeAnimalVaccSummary();
  const today = new Date(todayStr());
  let filtered = rows.filter(({last, nextDue}) => {
    if (!nextDue) return false;
    if (vaccine && (last?.name || last?.vaccine) !== vaccine) return false;
    const due = new Date(nextDue);
    const diff = Math.ceil((due - today) / (1000*60*60*24));
    return diff <= windowDays; // due within
  });

  // ✅ DEMO fallback: if no matches, return all rows
  if (!filtered.length) filtered = rows;

  return filtered;
}

  function openNotify(){
    // defaults
    el("ntf-window").value = 14;
    el("ntf-campdate").value = todayStr();
    el("ntf-location").value = "Village Vet Camp";
    updateAudiencePreview();
    ntfDlg.showModal();
  }

  function templ(str, m){
    return str
      .replaceAll("{OwnerName}", m.owner || "")
      .replaceAll("{AnimalId}", m.animalId)
      .replaceAll("{Vaccine}", m.vaccine)
      .replaceAll("{DueDate}", m.dueDate || "")
      .replaceAll("{CampDate}", m.campDate || "")
      .replaceAll("{Location}", m.location || "");
  }

  function updateAudiencePreview(){
    const vaccine = el("ntf-vaccine").value;
    const win = parseInt(el("ntf-window").value || 14);
    const campDate = el("ntf-campdate").value;
    const location = el("ntf-location").value;

    const rows = audienceFilter(vaccine, win);
    const div = el("ntf-audience");
    if (!rows.length){
      div.innerHTML = `<span class="muted">No owners match the filters.</span>`;
      return;
    }
    const sample = rows.slice(0, 3).map(({animal, last, nextDue}) => {
      return `${animal.ownerName || "Owner"} • ${animal.id} • ${last?.name || last?.vaccine || "—"} due ${nextDue}`;
    }).join("<br>");
    div.innerHTML = `<strong>${rows.length}</strong> owners matched.<br>${sample}`;
  }

  ["ntf-vaccine","ntf-window","ntf-campdate","ntf-location"].forEach(id=>{
    el(id)?.addEventListener("change", updateAudiencePreview);
  });

  function sendNotificationsDemo(){
    const vaccine = el("ntf-vaccine").value;
    const win = parseInt(el("ntf-window").value || 14);
    const campDate = el("ntf-campdate").value;
    const location = el("ntf-location").value;
    const tmpl = el("ntf-template").value;

    const rows = audienceFilter(vaccine, win);
    if (!rows.length){ alert("No recipients for current filters."); return; }

    // queue messages
    const queue = getJSON(LS_MSG);
    rows.forEach(({animal, last, nextDue}) => {
      const msg = templ(tmpl, {
        owner: animal.ownerName || "",
        animalId: animal.id,
        vaccine: (last?.name || last?.vaccine || vaccine || "vaccine"),
        dueDate: nextDue || "",
        campDate,
        location
      });
      queue.push({
        to: animal.ownerPhone || "",
        owner: animal.ownerName || "",
        animalId: animal.id,
        message: msg,
        createdAt: new Date().toISOString(),
        status: "queued" // demo
      });
    });
    setJSON(LS_MSG, queue);
    // Build a preview list for demo
    let preview = rows.map(({animal, last, nextDue}) => {
    return `${animal.ownerName || "Owner"} • ${animal.id} • ${last?.name || last?.vaccine || "—"} due ${nextDue || "—"}`;
    }).join("\n");

    alert(`📨 Notifications sent to ${rows.length} owners:\n\n${preview}`);
    ntfDlg.close();
  }

  el("btn-notify")?.addEventListener("click", openNotify);
  el("ntf-send")?.addEventListener("click", sendNotificationsDemo);
  el("ntf-cancel")?.addEventListener("click", () => ntfDlg.close());

  // Render tracker list whenever the screen is opened
  // naive: also render on load
  document.addEventListener("DOMContentLoaded", renderTrackerList);

  // expose a tiny helper in window (optional, for debugging in console)
  window._VT = { renderTrackerList };
})();











function resetDemoData(){
  if (confirm("Are you sure you want to reset all demo data?")) {
    localStorage.removeItem("flw_cattle_records_v1");
    localStorage.removeItem("flw_vax_events_v1");
    localStorage.removeItem("flw_msg_queue_v1");
    alert("Local demo data cleared!");
    location.reload(); // reload to show empty lists
  }
}






/* ================== PROGRESS & REWARDS (badges + leaderboard only) ================== */
(() => {
  function renderBadges(){
    const box = document.getElementById("pr-badges");
    if (!box) return;
    box.innerHTML = "";

    // demo static numbers (same as your static stats)
    const animals = 150;
    const vax = 120;

    const add = (label, earned) => {
      const span = document.createElement("span");
      span.className = "badge";
      span.textContent = label;
      if (!earned) span.style.opacity = 0.4; // show locked as faded
      box.appendChild(span);
    };

    add("🎖️ Cattle Champion (10+ animals)", animals >= 10);
    add("🏅 Top Vaccinator (20+ vax)", vax >= 20);
    add("⏱ On-Time Star (≥80% timely)", vax >= 100); // fake condition
  }

  function renderLeaderboard(){
    const ol = document.getElementById("pr-leaderboard");
    if (!ol) return;
    ol.innerHTML = "";

    // demo static points
    const rows = [
      { name: "You", pts: 250 },
      { name: "FLW B", pts: 200 },
      { name: "FLW C", pts: 180 }
    ];

    const emojis = ["🎖️", "🏅", "⏱"];

    rows.forEach((r, i) => {
      const li = document.createElement("li");
      li.textContent = `${emojis[i] || "✨"} ${r.name} — ${r.pts} pts`;
      ol.appendChild(li);
    });
  }

  function renderPR(){
    renderBadges();
    renderLeaderboard();
  }

  // run once when page loads
  document.addEventListener("DOMContentLoaded", renderPR);
})();





















/* ===== Photo Upload: read file, create thumbnail, show demo top-3 ===== */
const uploadInput = document.getElementById('uploadInput');
const uploadLabel = document.getElementById('uploadLabel');


  // allow keyboard/enter behaviour for label (accessibility)
  uploadLabel?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      uploadInput.click();
      e.preventDefault();
    }
  });



/** 
 * Renders the result card, stores last prediction, and auto-generates visible QR.
 */














/* ===== DEMO: Unified flow for Capture + Upload → Show Prediction → Confirm/Flag ===== */

/* last prediction state */
let _lastPrediction = null;

/* Utility: create thumbnail dataURL from <video id="camera"> */
async function getVideoSnapshotDataUrl() {
  const video = document.getElementById('camera');
  if (!video) return null;
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const c = document.createElement('canvas');
  c.width = Math.min(w, 800);
  c.height = Math.min(h, 600);
  const ctx = c.getContext('2d');
  ctx.drawImage(video, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85);
}

/* -------------- Capture flow (overwrite or complement your existing function) -------------- */
/* If you already have captureAndPredict(), replace its body with this or keep and call this. */
/* -------------- Capture flow (unified with <85% confidence check) -------------- */
async function captureAndPredict() {
  // 1) take snapshot
  const dataUrl = await getVideoSnapshotDataUrl();
  if (!dataUrl) return alert('No camera available or permission denied.');

  // 2) For demo: produce top3 confidences (you can replace this by real model inference)
  const demoTop3 = [
    { label: 'Gir', score: Math.floor(50 + Math.random()*40) },
    { label: 'Sahiwal', score: Math.floor(5 + Math.random()*30) },
    { label: 'Other', score: Math.floor(1 + Math.random()*10) }
  ];
  // normalize so totals look plausible
  const sum = demoTop3.reduce((s,it)=>s+it.score,0);
  demoTop3.forEach(it => it.score = Math.round((it.score / sum) * 100));

  // 3) 🔹 Confidence-based guided capture (threshold = 85%)
  const top = demoTop3[0];
  if (top.score < 60) {
    const overlay = document.getElementById("breed-overlay");
    overlay.textContent = "⚠️ Low confidence (<85%). Please retake photo (better lighting/angle).";
    overlay.classList.add("warning");
    overlay.classList.remove("hide");
    setTimeout(() => {
      overlay.classList.add("hide");
      overlay.classList.remove("warning");
    }, 4000);
    return; // ❌ stop here, don’t show results
  }

  // 4) ✅ If confident enough → show results
  displayResults(demoTop3, dataUrl, { origin: 'Demo', notes: 'Live-capture demo prediction' });
  showPredictionForConfirm(demoTop3, dataUrl);
}
/* -------------- Upload flow -------------- */

if (uploadInput) {
  uploadInput.addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;

    const name = (file.name || '').toLowerCase();
    const isGir = name.includes('gir');
    const isSahiwal = name.includes('sahiwal');


    const reader = new FileReader();
    reader.onload = (e) => {
    const dataUrl = e.target.result;

      let top3;
      if (isGir) {
        top3 = [
          {label:'Gir', score:92},
          {label:'Red Sindhi', score:5},
          {label:'Tharparkar', score:3}
        ];
      } else if (isSahiwal) {
        top3 = [
          {label:'Sahiwal', score:89},
          {label:'Red Sindhi', score:7},
          {label:'Gir', score:5}
        ];
      } else {
        top3 = [
          {label:'Gir', score: Math.floor(30 + Math.random()*40)},
          {label:'Sahiwal', score: Math.floor(10 + Math.random()*30)},
          {label:'Other', score: Math.floor(5 + Math.random()*20)}
        ];
      }

  if (!isGir && !isSahiwal) {
  const sum = top3.reduce((a,b)=>a+b.score,0);
  top3.forEach(it => it.score = Math.round((it.score / sum) * 100));
}


      // 🔹 Confidence-based guided capture (threshold = 85%)
      const top = top3[0];
      if (top.score < 50) {
        const overlay = document.getElementById("breed-overlay");
        overlay.textContent = `⚠️ Low confidence (${top.score}%). Please upload a clearer photo.`;
        overlay.classList.add("warning");
        overlay.classList.remove("hide");
        setTimeout(() => {
          overlay.classList.add("hide");
          overlay.classList.remove("warning");
        }, 4000);
        return;
      }

      // ✅ show results only if confident enough
      displayResults(top3, dataUrl, { origin:'Upload', notes:'Uploaded image (demo)' });
      showPredictionForConfirm(top3, dataUrl);
    };
    reader.readAsDataURL(file);
  });
}


/* -------------- displayResults(top3, thumbDataUrl, infoObj) -------------- */
/* Creates the result card with thumbnail, colorful bars, and info. If you already have a displayResults implementation, replace it with this or merge. */
function displayResults(top3, thumbDataUrl, infoObj = {}) {
  const out = document.getElementById('breedResults');
  if (!out) return;

  out.innerHTML = '';
  out.style.display = 'block';
  out.classList.add('show');

  const card = document.createElement('div');
  card.className = 'breed-card';

  // thumbnail
  if (thumbDataUrl) {
    const img = document.createElement('img');
    img.className = 'thumb';
    img.src = thumbDataUrl;
    img.alt = 'Captured image';
    card.appendChild(img);
  }

  // top title
  const best = top3 && top3.length ? top3[0] : null;
  const title = document.createElement('div');
  title.innerHTML = `<h3 style="margin:0">${best ? best.label : 'Unknown'}</h3>
                     <div style="color:#6b7280; font-size:0.95rem;">${best ? best.score + '% confidence' : ''}</div>`;
  title.style.marginBottom = '8px';
  card.appendChild(title);

  // confidence bars (simple colorful bars)
  const ul = document.createElement('ul');
  ul.className = 'confidence-list';
  (top3 || []).forEach((it, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.gap = '8px';
    li.style.alignItems = 'center';

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = it.label;

    const barWrap = document.createElement('div');
    barWrap.className = 'barWrap';
    barWrap.style.flex = '1';
    barWrap.style.background = '#f1f5f9';
    barWrap.style.borderRadius = '999px';
    barWrap.style.height = '18px';
    barWrap.style.overflow = 'hidden';

    const barFill = document.createElement('div');
    barFill.className = 'barFill';
    // color variants
    barFill.style.background = idx===0 ? 'linear-gradient(90deg,#ff9966,#ff5e62)' : idx===1 ? 'linear-gradient(90deg,#fbc7d4,#9796f0)' : 'linear-gradient(90deg,#60efbc,#58d5ff)';
    barFill.style.height = '100%';
    barFill.style.width = '0%';
    barFill.style.transition = 'width 700ms cubic-bezier(.2,.9,.3,1)';
    barWrap.appendChild(barFill);

    const pct = document.createElement('div');
    pct.className = 'pct';
    pct.style.width = '56px';
    pct.style.textAlign = 'right';
    pct.style.fontWeight = '700';
    pct.textContent = it.score + '%';

    li.appendChild(label);
    li.appendChild(barWrap);
    li.appendChild(pct);
    ul.appendChild(li);

    // animate slightly after append
    setTimeout(() => { barFill.style.width = Math.max(2, it.score) + '%'; }, 50);
  });
  card.appendChild(ul);

  // extra info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'breed-info';
  infoDiv.style.marginTop = '10px';

  // fallback if no info passed
const breedName = best ? best.label.toLowerCase() : 'other';
let details = {};

  if (breedName.includes('gir')) {
  details = {
    milk_yield: "12–15 L/day",
    milk_fat: "4.5%",
    native: "Gujarat",
    best_for: "Milk production in hot climate",
    diseases: "Mastitis (take preventive care)",
    vaccination: "FMD, Brucellosis (tap to record)"
  };
  } else if (breedName.includes('sahiwal')) {
  details = {
    milk_yield: "8–12 L/day",
    milk_fat: "4.0–4.5%",
    native: "Punjab (India/Pakistan)",
    best_for: "Heat-tolerant dairy production",
    diseases: "Parasitic infestations, tick fever (monitor)",
    vaccination: "FMD, Brucellosis, HS (tap to record)"
  };
} else {
  details = {
    milk_yield: infoObj.milk_yield || "—",
    milk_fat: infoObj.milk_fat || "—",
    native: infoObj.origin || "—",
    best_for: infoObj.uses || "—",
    diseases: "—",
    vaccination: "—"
  };
}
infoDiv.innerHTML = `
  <h4>Breed Info</h4>
  <p><strong>Milk Yield:</strong> ${details.milk_yield}</p>
  <p><strong>Milk Fat:</strong> ${details.milk_fat}</p>
  <p><strong>Native:</strong> ${details.native}</p>
  <p><strong>Best for:</strong> ${details.best_for}</p>
  <p><strong>Common Diseases:</strong> ${details.diseases}</p>
  <p><strong>Vaccination Due:</strong> ${details.vaccination}</p>
`;

card.appendChild(infoDiv);

  // --- Feed recommendation (auto, created dynamically) ---
const feedDiv = document.createElement('div');
feedDiv.className = 'feed-reco';
feedDiv.style.marginTop = '12px';
const milkYieldText = details.milk_yield || infoObj.milk_yield || '—';
const feedText = getFeedRecommendation(best ? best.label : 'Unknown', milkYieldText);

const feedParts = feedText.split("→ Recommend ")[1].split("+");
feedDiv.innerHTML = `
  <h4>🐄 Feed Recommendation</h4>
  <p class="feed-text"><strong>${best.label}</strong> (${milkYieldText})</p>
  <ul class="feed-list">
    ${feedParts.map(item => `<li>${item.trim()}</li>`).join("")}
  </ul>
  <button class="action-button" onclick="sendFeedToFarmer()">📩 Send to Farmer</button>
`;

  card.appendChild(feedDiv);


// 🩺 Health Anomaly Pre-Check (demo logic)
if (typeof _lastFileName === "string") {
  const imgName = _lastFileName.toLowerCase();

  const healthDiv = document.createElement("div");
  healthDiv.className = "health-check";
  healthDiv.style.marginTop = "12px";
  healthDiv.style.padding = "10px";
  healthDiv.style.border = "1px solid #f87171";
  healthDiv.style.borderRadius = "8px";
  healthDiv.style.background = "#fff8f8";

  if (imgName.includes("eye")) {
    healthDiv.innerHTML = `<h4>🩺 Health Check Assist</h4><p>⚠️ Possible <b>eye infection</b> detected. Please consult a vet.</p>`;
    card.appendChild(healthDiv);
  } else if (imgName.includes("wound")) {
    healthDiv.innerHTML = `<h4>🩺 Health Check Assist</h4><p>⚠️ Possible <b>wound or injury</b> spotted. Monitor and apply treatment.</p>`;
    card.appendChild(healthDiv);
  } else {
    // random malnutrition demo (20% chance)
    if (Math.random() < 0.2) {
      healthDiv.innerHTML = `<h4>🩺 Health Check Assist</h4><p>⚠️ Signs of <b>malnutrition</b> detected. Review feed plan.</p>`;
      card.appendChild(healthDiv);
    }
  }
}



  // append to output
  out.appendChild(card);

  // save last prediction state
  _lastPrediction = { top3, thumb: thumbDataUrl, info: infoObj, ts: new Date().toISOString() };

  // show confirm + flag buttons (they were hidden initially)
  const bc = document.getElementById('btnConfirmBreed');
  const bf = document.getElementById('btnFlagBreed');
  if (bc) bc.style.display = 'block';
  if (bf) bf.style.display = 'block';

  // focus confirm for quick interaction
  setTimeout(() => bc?.focus(), 120);

    // small debug: log feed text in console so you can check
  console.log("Feed recommendation:", feedText);
}

/* -------------- showPredictionForConfirm (helper) -------------- */
function showPredictionForConfirm(top3, thumbDataUrl, meta = null) {
  _lastPrediction = { top3, thumb: thumbDataUrl, meta, ts: new Date().toISOString() };
  const bc = document.getElementById('btnConfirmBreed');
  const bf = document.getElementById('btnFlagBreed');
  if (bc) bc.style.display = 'block';
  if (bf) bf.style.display = 'block';
}


function flagBreed(flagReason = '') {
  if (!_lastPrediction || !_lastPrediction.top3 || !_lastPrediction.top3.length) {
    return alert("No prediction to flag. Capture or upload a photo first.");
  }

  const entry = {
    id: "FLAG-" + Date.now().toString(36),
    ts: new Date().toISOString(),
    prediction: _lastPrediction.top3,
    thumbnail: _lastPrediction.thumb || null,
    recordId: _lastPrediction.recordId || null,
    note: flagReason || null
  };

  const LS_FLAG = "flw_flagged_predictions_v1";
  let flags = [];
  try { flags = JSON.parse(localStorage.getItem(LS_FLAG)) || []; } catch(e) { flags = []; }
  flags.push(entry);
  localStorage.setItem(LS_FLAG, JSON.stringify(flags));

  alert("🚩 Prediction flagged for review.");

  // reset UI so next classification can start
  resetPredictionUI();
}





























/* -------------- resetPredictionUI -------------- */
function resetPredictionUI() {
  _lastPrediction = null;
  const out = document.getElementById('breedResults');
  if (out) { out.innerHTML = ''; out.style.display = 'none'; out.classList.remove('show'); }
  const bc = document.getElementById('btnConfirmBreed');
  const bf = document.getElementById('btnFlagBreed');
  if (bc) bc.style.display = 'none';
  if (bf) bf.style.display = 'none';
  // leave camera running for next capture
}













function generateQRForRecord(recordId) {
  // ensure QR lib loaded
  if (typeof QRCode === 'undefined') {
    alert("QR library not loaded.");
    return;
  }

  // show container
  const qrBox = document.getElementById('qrcode');
  qrBox.innerHTML = '';
  document.getElementById('qrContainer').style.display = 'block';

  // payload to embed in QR
  const payload = JSON.stringify({ id: recordId, source: "breed-demo" });

  new QRCode(qrBox, {
    text: payload,
    width: 180,
    height: 180,
    colorDark: "#222",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

function closeQR() {
  document.getElementById('qrContainer').style.display = 'none';
  document.getElementById('qrcode').innerHTML = '';
}

function toggleLanguageSelect() {
  const container = document.getElementById("languageSelectContainer");
  if (!container) return;

  if (container.style.display === "none") {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
}





function openLanguagePopup() {
  document.getElementById("languagePopup").style.display = "flex";
}

function closeLanguagePopup() {
  document.getElementById("languagePopup").style.display = "none";
}

function changeLanguage(lang) {
  localStorage.setItem("selectedLanguage", lang);
  applyTranslations(lang);
  closeLanguagePopup();
}

function applyLanguage() {
  const lang = document.getElementById("languageSelect").value;
  localStorage.setItem("selectedLanguage", lang);
  applyTranslations(lang);
  closeLanguagePopup();
  showScreen('dashboard-screen'); // ✅ go back to Dashboard  
}

function applyTranslations(lang) {
  const t = translations[lang] || translations.en;
  // Dashboard heading
  document.querySelector("#dashboard-screen .welcome-message").innerText = t.dashboard;
  document.querySelector("#dashboard-screen .welcome-subtext").innerText = t.welcome_subtext;

  document.querySelector("#dashboard-screen h2").innerText = t.dashboard;
  document.querySelector("[onclick*='breed-recognition-screen'] h3").innerText = t.breedRecognition;
  document.querySelector("[onclick*='vaccination-tracker-screen'] h3").innerText = t.vaccinationTracker;
  document.querySelector("[onclick*='emergency-vet-connect-screen'] h3").innerText = t.emergencyVet;
  document.querySelector("[onclick*='cattle-records-screen'] h3").innerText = t.myRecords;
  document.querySelector("[onclick*='tasks-alerts-screen'] h3").innerText = t.tasks;
  document.querySelector("[onclick*='progress-rewards-screen'] h3").innerText = t.progress;

  document.getElementById("btnConfirmBreed").innerText = t.confirmBreed;
  document.getElementById("btnFlagBreed").innerText = t.flagBreed;

  document.querySelectorAll(".back-button").forEach(btn => btn.innerText = t.back);

  // Settings options
  document.querySelector(".settings-option p").innerText = t.changeLanguage;
  document.querySelector("#voiceAssistantToggle").parentNode.lastChild.textContent = " " + t.voiceAssistant;
  document.querySelector(".logout-button").innerText = t.logout;


}


document.addEventListener("DOMContentLoaded", () => {
  preloadDemoData();  // ensure demo data exists
  const savedLang = localStorage.getItem("selectedLanguage") || "en";
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) langSelect.value = savedLang;
  applyTranslations(savedLang);
});


function preloadDemoData() {
  let existing = JSON.parse(localStorage.getItem("cattle_records") || "[]");
  if (!existing.length) {
    const demoRecords = [
      {
        id: "COW001",
        breed: "Gir",
        ownerName: "Ramesh",
        vaccinations: [
          { vaccine: "FMD", date: "2025-08-25" },
          { vaccine: "Brucellosis", date: "2025-07-15" }
        ]
      },
      {
        id: "COW002",
        breed: "Sahiwal",
        ownerName: "Sita",
        vaccinations: [
          { vaccine: "FMD", date: "2025-09-01" }
        ]
      }
    ];
    localStorage.setItem("cattle_records", JSON.stringify(demoRecords));
    console.log("✅ Demo cattle records preloaded");
  } else {
    console.log("ℹ️ Using existing cattle_records");
  }
}

  


