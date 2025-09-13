// Hide loader once page fully loads
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  if (loader) loader.style.display = "none";
  if (content) content.style.display = "block";
});
