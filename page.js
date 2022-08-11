const fun = document.querySelectorAll(".transparent");

fun.forEach(button => {
  button.addEventListener("click", () => {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 }
  });
})
});