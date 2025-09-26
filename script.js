//BUTTON BACK TO TOP
document.addEventListener("DOMContentLoaded", function() {
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", function() {
      // Affiche le bouton lors du premier scroll depuis le haut
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          backToTopBtn.style.display = "block";
      } else {
          backToTopBtn.style.display = "none";
      }
  });
});