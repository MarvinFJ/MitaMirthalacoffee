console.log("Página legal cargada correctamente");


const menuToggle = document.getElementById("menuToggle");
const legalNav = document.getElementById("legalNav");

menuToggle.addEventListener("click", () => {
    legalNav.classList.toggle("active");
});
