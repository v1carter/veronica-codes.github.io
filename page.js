import confetti from "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"


const fun = document.querySelector(".transparent");

fun.addEventListener("click", () => {
  confetti();
});