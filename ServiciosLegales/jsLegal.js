console.log("Página legal cargada correctamente");


const menuToggle = document.getElementById("menuToggle");
const legalNav = document.getElementById("legalNav");

menuToggle.addEventListener("click", () => {
    legalNav.classList.toggle("active");
});
 

document.addEventListener("DOMContentLoaded", () => {

  const counters = document.querySelectorAll(".stats h3");
  const statsSection = document.querySelector(".stats");
  let hasAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const start = counter.dataset.start
        ? parseInt(counter.dataset.start)
        : 0;

      const prefix = counter.dataset.prefix || "";
      const suffix = counter.dataset.suffix || "";

      let current = start;
      const isReverse = start > target;
      const speed = 90;

      const update = () => {
        const step = Math.ceil(Math.abs(target - start) / speed);

        if (isReverse) {
          current -= step;
          if (current <= target) current = target;
        } else {
          current += step;
          if (current >= target) current = target;
        }

        counter.textContent = `${prefix}${current}${suffix}`;

        if (current !== target) {
          requestAnimationFrame(update);
        }
      };

      update();
    });
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !hasAnimated) {
      animateCounters();
      hasAnimated = true;
    }
  }, { threshold: 0.20 });

  observer.observe(statsSection);
});

/*JavaScript (detecta scroll y anima en orden TRES SECCIONES */

document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".services .card");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        entry.target.classList.add("show");
        observer.unobserve(entry.target); // 👈 solo una vez
      }
    });
  }, {
    threshold: 0.2
  });

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.35}s`; // 👈 MÁS LENTO
    observer.observe(card);
  });

});

/* detecta scroll + tamaño de pantalla SECCION SOBRE MI*/

document.addEventListener("DOMContentLoaded", () => {
    const aboutText = document.querySelector(".about-text");

    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;

    // Aplicar animación inicial según dispositivo
    if (isMobile) {
        aboutText.classList.add("from-bottom");
    } else {
        aboutText.classList.add("from-right");
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutText.classList.add("show");
                    observer.unobserve(aboutText); // solo una vez
                }
            });
        },
        {
            threshold: 0.3
        }
    );

    observer.observe(aboutText);
});