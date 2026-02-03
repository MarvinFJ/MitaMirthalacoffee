// ================= CAROUSEL =================
const slide = document.querySelector(".carousel-slide");
if (slide) {
    const slides = document.querySelectorAll(".carousel-slide img");
    let counter = 0;

    function nextSlide() {
        counter++;
        if (counter >= slides.length) counter = 0;
        const slideWidth = slides[0].clientWidth + 10;
        slide.style.transform = `translateX(-${counter * slideWidth}px)`;
    }

    setInterval(nextSlide, 3000);
}

// ================= CARRITO + BUSCADOR + LIGHTBOX =================
document.addEventListener("DOMContentLoaded", () => {

    // ======= ELEMENTOS =======
    const botonesCarrito = document.querySelectorAll(".agregar-carrito");
    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");
    const btnComprar = document.getElementById("btnComprar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const buscadorInput = document.getElementById("buscador");
    const verComprasBtn = document.getElementById("verCompras");

    if (!listaCarrito || !totalCarrito || !btnComprar) return;

    // ================= CARRO OPTIMIZADO =================
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Guarda carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // Renderiza carrito en pantalla
    function renderCarrito() {
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const li = document.createElement("li");
            li.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-img">
            <div class="carrito-info">
                <strong>${item.nombre}</strong>
                <small>
                    C$ ${item.precio} x ${item.cantidad} = <b>C$ ${subtotal}</b>
                </small>
            </div>
            <div class="acciones-carrito">
                <button class="btn-restar" data-index="${index}">−</button>
                <button class="btn-sumar" data-index="${index}">+</button>
                <button class="btn-eliminar" data-index="${index}">❌</button>
            </div>
            `;
            listaCarrito.appendChild(li);
        });

        totalCarrito.textContent = total;

        // Eventos dinámicos
        document.querySelectorAll(".btn-sumar").forEach(btn =>
            btn.onclick = e => {
                carrito[e.target.dataset.index].cantidad++;
                guardarCarrito();
                renderCarrito();
            }
        );

        document.querySelectorAll(".btn-restar").forEach(btn =>
            btn.onclick = e => {
                const i = e.target.dataset.index;
                if (carrito[i].cantidad > 1) carrito[i].cantidad--;
                else carrito.splice(i, 1);
                guardarCarrito();
                renderCarrito();
            }
        );

        document.querySelectorAll(".btn-eliminar").forEach(btn =>
            btn.onclick = e => {
                carrito.splice(e.target.dataset.index, 1);
                guardarCarrito();
                renderCarrito();
            }
        );
    }

    // Agregar producto al carrito
    botonesCarrito.forEach(btn => {
        btn.addEventListener("click", e => {
            const productoDiv = e.target.closest(".producto");
            if (!productoDiv) return;

            const nombre = productoDiv.dataset.nombre;
            const precio = parseFloat(productoDiv.dataset.precio);
            const imagen = productoDiv.querySelector("img").src;

            const productoExistente = carrito.find(p => p.nombre === nombre && p.precio === precio);
            if (productoExistente) productoExistente.cantidad++;
            else carrito.push({ nombre, precio, cantidad: 1, imagen });

            guardarCarrito();
            renderCarrito();
            mostrarToast(`${nombre} agregado al carrito ✅`);
        });
    });

    // Limpiar carrito
    function limpiarCarrito() {
        carrito = [];
        guardarCarrito();
        renderCarrito();
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            if (!carrito.length) {
                alert("El carrito ya está vacío 🛒");
                return;
            }

            if (!confirm("¿Deseas vaciar todo el carrito? 🗑️")) return;

            limpiarCarrito();
        });
    }

    // Comprar
    if (btnComprar) {
        btnComprar.addEventListener("click", () => {
            if (!carrito.length) return alert("Tu carrito está vacío 😅");
            let mensaje = "Hola, quiero comprar estos productos:\n\n";
            carrito.forEach((p, i) => mensaje += `${i + 1}. ${p.nombre} x${p.cantidad} - C$ ${p.precio * p.cantidad}\n`);
            mensaje += `\nTotal: C$ ${carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)}`;
            window.open(`https://wa.me/50587533951?text=${encodeURIComponent(mensaje)}`, "_blank");

            limpiarCarrito(); // Limpiar después de comprar
        });
    }

    // ================= BUSCADOR =================
    if (buscadorInput) {
        buscadorInput.addEventListener("input", () => {
            const texto = buscadorInput.value.toLowerCase();
            document.querySelectorAll(".productos-grid").forEach(grid => {
                let hayCoincidencia = false;
                grid.querySelectorAll(".producto").forEach(prod => {
                    if (prod.dataset.nombre.toLowerCase().includes(texto)) {
                        prod.style.display = "block";
                        hayCoincidencia = true;
                    } else prod.style.display = "none";
                });
                (grid.closest("section") || grid.parentElement).style.display = hayCoincidencia ? "block" : "none";
            });
        });
    }

    // ================= VER CARRITO =================
    if (verComprasBtn) {
        verComprasBtn.addEventListener("click", () => {
            const carritoSection = document.querySelector(".carrito");
            if (carritoSection) carritoSection.scrollIntoView({ behavior: "smooth" });
        });
    }

    // Inicializar carrito
    renderCarrito();

    // ================= TOAST =================
    function mostrarToast(mensaje) {
        // Crear contenedor si no existe
        let contenedor = document.querySelector(".toast-container");
        if (!contenedor) {
            contenedor = document.createElement("div");
            contenedor.className = "toast-container";
            document.body.appendChild(contenedor);
        }

        // Crear el toast
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = mensaje;

        contenedor.appendChild(toast);

        // Mostrar animación
        setTimeout(() => toast.classList.add("show"), 50);

        // Desaparecer después de 2 segundos
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }


});

// ============ ANIMACIONES TIPO GOOGLE FADE-UP ==========
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

// ================== SONIDO AL AGREGAR PRODUCTO ==================
const sonidoClick = document.getElementById("sonidoClick");

document.addEventListener("click", function (e) {
    // Detecta cualquier botón de agregar al carrito
    if (e.target.closest(".precio-carrito button")) {
        sonidoClick.currentTime = 0;
        sonidoClick.play().catch(() => { });
    }
});

// ===== SECCION DEL TEXTO ANIMADO CAFE RAPIDO =====
document.addEventListener("DOMContentLoaded", () => {
    const videoTexto = document.querySelector(".video-texto");
    if (!videoTexto) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                videoTexto.classList.add("animate");
                observer.unobserve(videoTexto);
            }
        },
        { threshold: 0.3 }
    );

    observer.observe(videoTexto);
});

const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close-modal");

document.querySelectorAll(".product-img").forEach(img => {
    img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = img.src;
    });
});

// Cerrar con botón
closeBtn.onclick = () => {
    modal.style.display = "none";
};

// Cerrar al hacer click fuera
modal.onclick = (e) => {
    if (e.target === modal || e.target === modalImg) {
        modal.style.display = "none";
    }
};
