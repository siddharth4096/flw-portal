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

// 🟢 FLW Login Simulation
document.getElementById("flwLoginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const flwId = document.getElementById("flwId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (flwId && password) {
    alert(`✅ Logged in as VET ID: ${flwId}`);
    sessionStorage.setItem("isVetLoggedIn", "true");   // ✅ store login flag
    window.location.href = "../vet-dashboard/test.html";    //need changes here
  } else {
    alert("⚠️ Please enter valid VET ID and Password!");
  }
});

// 🚀 Demo Mode Simulation
function demoLogin() {
  alert("🚀 Demo Mode Activated!\nYou can explore the FLW Portal without credentials.");
  sessionStorage.setItem("isVetLoggedIn", "true");   // ✅ store login flag
  window.location.href = "../vet-dashboard/test.html";
}
