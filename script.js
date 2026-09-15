document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       01. MENÚ MÓVIL
    ========================================================= */

    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mainNav.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        // Cerrar el menú al seleccionar una opción
        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


        // Cerrar si se hace clic fuera del menú
        document.addEventListener("click", (event) => {

            const clickedInsideMenu =
                mainNav.contains(event.target);

            const clickedToggle =
                menuToggle.contains(event.target);

            if (
                !clickedInsideMenu &&
                !clickedToggle &&
                mainNav.classList.contains("active")
            ) {

                mainNav.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    /* =========================================================
       02. DESPLAZAMIENTO SUAVE
       
       Todos los enlaces internos como:
       href="#agenda"
       href="#tratamientos"
       href="#preguntas"
       
       se desplazan dentro de la misma página.
    ========================================================= */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Actualiza la URL sin recargar la página
            history.pushState(null, "", targetId);

        });

    });


    /* =========================================================
       03. ANIMACIONES AL HACER SCROLL
    ========================================================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        // Compatibilidad con navegadores antiguos
        revealElements.forEach((element) => {

            element.classList.add("is-visible");

        });

    }


    /* =========================================================
       04. FAQ
       
       Permite mantener una sola pregunta abierta.
    ========================================================= */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {

        item.addEventListener("toggle", () => {

            if (!item.open) {
                return;
            }

            faqItems.forEach((otherItem) => {

                if (
                    otherItem !== item &&
                    otherItem.open
                ) {
                    otherItem.removeAttribute("open");
                }

            });

        });

    });


    /* =========================================================
       05. PREVENIR PROBLEMAS DE SCROLL HORIZONTAL
       
       No modifica el contenido ni fuerza tamaños.
       Solo ayuda a detectar elementos que accidentalmente
       sobresalgan del viewport durante el desarrollo.
    ========================================================= */

    const checkHorizontalOverflow = () => {

        const documentWidth =
            document.documentElement.scrollWidth;

        const viewportWidth =
            window.innerWidth;

        if (documentWidth > viewportWidth + 1) {

            document.body.classList.add(
                "has-horizontal-overflow"
            );

        } else {

            document.body.classList.remove(
                "has-horizontal-overflow"
            );

        }

    };


    window.addEventListener(
        "resize",
        checkHorizontalOverflow
    );

    checkHorizontalOverflow();


    /* =========================================================
       06. AÑO AUTOMÁTICO DEL FOOTER
       
       Busca el texto del copyright y coloca el año actual.
    ========================================================= */

    const footerBottom = document.querySelector(
        ".footer__bottom"
    );

    if (footerBottom) {

        const copyright = footerBottom.querySelector("span");

        if (copyright) {

            copyright.textContent =
                `© ${new Date().getFullYear()} Consultorio Integral OC`;

        }

    }


    /* =========================================================
       07. PROTECCIÓN BÁSICA DE IMÁGENES
       
       Evita que una imagen arrastrada accidentalmente
       genere una navegación inesperada.
    ========================================================= */

    const images = document.querySelectorAll("img");

    images.forEach((image) => {

        image.setAttribute(
            "draggable",
            "false"
        );

    });

});


/* =========================================================
   CARRUSEL DE TRATAMIENTOS
========================================================= */

const treatmentsTrack = document.getElementById("treatments-track");
const treatmentsPrev = document.getElementById("treatments-prev");
const treatmentsNext = document.getElementById("treatments-next");
const treatmentsDots = document.getElementById("treatments-dots");

if (
    treatmentsTrack &&
    treatmentsPrev &&
    treatmentsNext &&
    treatmentsDots
) {

    const cards = Array.from(
        treatmentsTrack.querySelectorAll(".treatment-card")
    );

    let currentIndex = 0;


    /* Crear indicadores */

    cards.forEach((card, index) => {

        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "carousel-dot";

        dot.setAttribute(
            "aria-label",
            `Ver tratamiento ${index + 1}`
        );

        dot.addEventListener("click", () => {
            goToTreatment(index);
        });

        treatmentsDots.appendChild(dot);

    });


    const dots = Array.from(
        treatmentsDots.querySelectorAll(".carousel-dot")
    );


    /* Ir a una tarjeta */

    function goToTreatment(index) {

        currentIndex = Math.max(
            0,
            Math.min(index, cards.length - 1)
        );

        const card = cards[currentIndex];

        treatmentsTrack.scrollTo({
            left: card.offsetLeft,
            behavior: "smooth"
        });

        updateDots();

    }


    /* Actualizar indicadores */

    function updateDots() {

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        });

    }


    /* Botón anterior */

    treatmentsPrev.addEventListener("click", () => {

        goToTreatment(currentIndex - 1);

    });


    /* Botón siguiente */

    treatmentsNext.addEventListener("click", () => {

        goToTreatment(currentIndex + 1);

    });


    /* Detectar tarjeta visible */

    treatmentsTrack.addEventListener("scroll", () => {

        const scrollLeft = treatmentsTrack.scrollLeft;

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {

            const distance = Math.abs(
                card.offsetLeft - scrollLeft
            );

            if (distance < closestDistance) {

                closestDistance = distance;
                closestIndex = index;

            }

        });

        currentIndex = closestIndex;

        updateDots();

    });


    updateDots();

}