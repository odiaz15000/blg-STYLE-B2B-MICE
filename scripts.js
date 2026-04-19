/*===================================================================================================================
   SCRIPTS UNIFICADOS: BAIXA LISBON GROUP
   Incluye: Slider de Platos, Lightbox, Slider de Restaurantes, Navbar y Footer
=====================================================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
    // CARGAR NAVBAR Y ACTIVAR MENÚ MÓVIL
    const navbarContainer = document.getElementById('universal-navbar');
    if (navbarContainer) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;

                const menuBtn = document.getElementById('mobile-menu');
                const navLinks = document.getElementById('nav-links');

                if (menuBtn && navLinks) {
                    menuBtn.addEventListener('click', () => {
                        navLinks.classList.toggle('active');
                        // Cambia el icono de barras a X
                        const icon = menuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.toggle('fa-bars');
                            icon.classList.toggle('fa-times');
                        }
                    });
                }
                // --------------------------------------------
            })
            .catch(error => console.error('Error cargando la navbar:', error));
    }

    // Cargar Footer
    const footerPlaceholder = document.getElementById('universal-footer');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('No se encontró footer.html');
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                // Forzamos visibilidad para la animación reveal
                footerPlaceholder.style.opacity = "1";
                footerPlaceholder.style.transform = "translateY(0)";
            })
            .catch(err => {
                console.error("Error cargando el footer:", err);
                footerPlaceholder.innerHTML = "<p style='color:white; text-align:center;'>Error loading footer.</p>";
            });
    }

    /* --- 2. SLIDER DE PLATOS (MENU) --- */
    function moveSlide(direction, sliderId) {
        const sliderContainer = document.getElementById(sliderId);
        if (!sliderContainer) return;

        const slider = sliderContainer.querySelector('.slides');
        if (!slider) return;

        const slidesCount = slider.children.length;
        let index = parseInt(slider.getAttribute("data-index") || 0);

        index += direction;

        if (index < 0) index = slidesCount - 1;
        if (index >= slidesCount) index = 0;

        slider.style.transform = `translateX(-${index * 100}%)`;
        slider.setAttribute("data-index", index);
    }

    // Eventos para botones Prev/Next del menú
    const sliderButtons = document.querySelectorAll('.slider-buttons button');
    sliderButtons.forEach(btn => {
        btn.onclick = () => {
            const direction = btn.textContent.trim() === 'Prev' ? -1 : 1;
            moveSlide(direction, 'menuSlider');
        };
    });

    /* --- 3. AUTO SLIDER MENU --- */
    const menuSlider = document.getElementById('menuSlider');
    if (menuSlider) {
        let autoSlide = setInterval(() => moveSlide(1, 'menuSlider'), 3000);
        menuSlider.onmouseenter = () => clearInterval(autoSlide);
        menuSlider.onmouseleave = () => {
            autoSlide = setInterval(() => moveSlide(1, 'menuSlider'), 3000);
        };
    }

    /* --- 4. LIGHTBOX DE GALERÍA --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));

    if (lightbox && galleryImages.length > 0) {
        const closeBtn = lightbox.querySelector('.close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            lightbox.style.display = 'flex';
            lightboxImg.src = galleryImages[currentIndex].src;
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
        };

        galleryImages.forEach((img, i) => {
            img.onclick = () => openLightbox(i);
            img.setAttribute('loading', 'lazy');
        });

        closeBtn.onclick = () => { lightbox.style.display = 'none'; };

        lightbox.onclick = (e) => {
            if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
                lightbox.style.display = 'none';
            }
        };

        nextBtn.onclick = (e) => { e.stopPropagation(); showNext(); };
        prevBtn.onclick = (e) => { e.stopPropagation(); showPrev(); };
    }

    /* --- 5. SLIDER DE RESTAURANTES (PÁGINA INDEX) --- */
    const track = document.querySelector('.res-slides-track');
    const btnNextRes = document.getElementById('btnNextRes');
    const btnPrevRes = document.getElementById('btnPrevRes');
    const resWrapper = document.querySelector('.res-slider-wrapper');

    if (track && btnNextRes && btnPrevRes) {
        let resIndex = 0;
        let autoPlayRes;

        const updateResSlider = () => {
            const items = track.children.length;
            const itemsPerPage = window.innerWidth > 768 ? 3 : 1;
            const totalSteps = Math.ceil(items / itemsPerPage);

            if (resIndex >= totalSteps) resIndex = 0;
            if (resIndex < 0) resIndex = totalSteps - 1;

            track.style.transform = `translateX(-${resIndex * 100}%)`;
        };

        const nextSlide = () => {
            resIndex++;
            updateResSlider();
        };

        const startAutoPlay = () => {
            autoPlayRes = setInterval(nextSlide, 3000);
        };

        startAutoPlay();

        if (resWrapper) {
            resWrapper.onmouseenter = () => clearInterval(autoPlayRes);
            resWrapper.onmouseleave = () => startAutoPlay();
        }

        btnNextRes.onclick = (e) => {
            e.preventDefault();
            clearInterval(autoPlayRes);
            nextSlide();
            startAutoPlay();
        };

        btnPrevRes.onclick = (e) => {
            e.preventDefault();
            clearInterval(autoPlayRes);
            resIndex--;
            updateResSlider();
            startAutoPlay();
        };

        window.addEventListener('resize', () => {
            resIndex = 0;
            track.style.transform = 'translateX(0)';
        });
    }

    /* --- 6. LÓGICA ESPECÍFICA DE RESERVATIONS --- */
    const restaurantSelect = document.getElementById('restaurantSelect');

    // Solo ejecutamos esto si detectamos que estamos en la página de Reservas
    if (restaurantSelect) {
        const menuSelect = document.getElementById('menuSelect');
        const m3Mode = document.getElementById('m3_mode');
        const m3Main2Container = document.getElementById('container_m3_main2');
        const m3PriceDisplay = document.getElementById('m3_price_display');
        const m3LabelMain1 = document.getElementById('label_m3_main1');
        // NUEVA LÍNEA: Referencia al input oculto del precio
        const m3PriceInput = document.getElementById('m3_price_input');

        const menuBoxes = {
            'MENU 1 GROUPS': document.getElementById('menu1Details'),
            'MENU 2 FADO': document.getElementById('menu2Details'),
            'MENU 3 EVENTS': document.getElementById('menu3Details'),
            'MENU 4 STUDENTS': document.getElementById('menu4Details'),
            'STANDARD MENU': document.getElementById('brasaStandardDetails'),
            'CORK MENU 1': document.getElementById('corkMenu1Details'),
            'CORK MENU 2': document.getElementById('corkMenu2Details'),
            'AVÓ MENU 1': document.getElementById('avoMenu1Details'),
            'AVÓ MENU 2': document.getElementById('avoMenu2Details'),
            'TASTING 1 (Small)': document.getElementById('avoTasting1Details'),
            'TASTING 2 (Premium)': document.getElementById('avoTasting2Details'),
            'TASTING 3 (Cheese)': document.getElementById('avoTasting3Details'),
            'CUCINA STANDARD': document.getElementById('cucinaStandardDetails'),
            'MENU 1 LISBOA': document.getElementById('clanMenu1Details'),
            'MENU 2 PORTUGAL': document.getElementById('clanMenu2Details'),
            'NATA MENU 1': document.getElementById('nataMenu1Details'),
            'NATA MENU 2': document.getElementById('nataMenu2Details'),
            'NATA MENU 3': document.getElementById('nataMenu3Details'),
            'MENU NICOLA': document.getElementById('nicolaMenuDetails'),
            'PATA MENU 1': document.getElementById('pataMenu1Details'),
            'PATA MENU 2': document.getElementById('pataMenu2Details'),
            'PATA MENU 3': document.getElementById('pataMenu3Details'),
            'PATA MENU 4': document.getElementById('pataMenu4Details')
        };

        function resetMenuBoxes() {
            Object.values(menuBoxes).forEach(box => {
                if (box) {
                    box.style.display = 'none';
                    box.querySelectorAll('select').forEach(s => {
                        s.selectedIndex = 0;
                        s.required = false;
                        s.disabled = false;
                    });
                }
            });
            if (m3Main2Container) m3Main2Container.style.display = 'none';
            if (m3PriceDisplay) m3PriceDisplay.innerText = 'Price: 45,00€';
            if (m3LabelMain1) m3LabelMain1.innerText = 'Main Course:';
            if (m3PriceInput) m3PriceInput.value = '45,00€';
        }

        restaurantSelect.addEventListener('change', function () {
            menuSelect.innerHTML = '<option value="" disabled selected>Choose a menu</option>';
            resetMenuBoxes();
            const rest = this.value;
            let menus = [];

            if (rest === 'ALDEA') menus = ['MENU 1 GROUPS', 'MENU 2 FADO', 'MENU 3 EVENTS', 'MENU 4 STUDENTS'];
            else if (rest === 'CORK KITCHEN') menus = ['CORK MENU 1', 'CORK MENU 2'];
            else if (rest === 'BRASA D’OURO') menus = ['STANDARD MENU'];
            else if (rest === 'COZINHA D’AVÓ CELESTE') menus = ['AVÓ MENU 1', 'AVÓ MENU 2', 'TASTING 1 (Small)', 'TASTING 2 (Premium)', 'TASTING 3 (Cheese)'];
            else if (rest === 'CUCINA DI FAMIGLIA') menus = ['CUCINA STANDARD'];
            else if (rest === 'EL CLAN') menus = ['MENU 1 LISBOA', 'MENU 2 PORTUGAL'];
            else if (rest === 'NATA DE LISBOA') menus = ['NATA MENU 1', 'NATA MENU 2', 'NATA MENU 3'];
            else if (rest === 'NICOLA CAFÉ') menus = ['MENU NICOLA'];
            else if (rest === 'PATA NEGRA') menus = ['PATA MENU 1', 'PATA MENU 2', 'PATA MENU 3', 'PATA MENU 4'];
            else menus = ['STANDARD MENU'];

            menus.forEach(m => {
                let opt = document.createElement('option');
                opt.value = m;
                opt.text = m;
                menuSelect.appendChild(opt);
            });
        });

        if (menuSelect) {
            menuSelect.addEventListener('change', function () {
                resetMenuBoxes();
                const activeBox = menuBoxes[this.value];
                if (activeBox) {
                    activeBox.style.display = 'block';
                    activeBox.querySelectorAll('select').forEach(s => {
                        if (s.name !== 'm3_main2') s.required = true;
                    });
                }
            });
        }

        if (m3Mode) {
            m3Mode.addEventListener('change', function () {
                const main2Select = m3Main2Container.querySelector('select');
                // CAMBIO AQUÍ: Ahora coincide con el value del HTML
                if (this.value === '2 Main Courses') {
                    m3Main2Container.style.display = 'block';
                    m3LabelMain1.innerText = 'First Main Course:';

                    if (m3PriceDisplay) m3PriceDisplay.innerText = 'Price: 60,00€';
                    if (m3PriceInput) m3PriceInput.value = '60,00€ Per person (VAT included)';

                    if (main2Select) main2Select.required = true;
                } else {
                    m3Main2Container.style.display = 'none';
                    m3LabelMain1.innerText = 'Main Course:';

                    if (m3PriceDisplay) m3PriceDisplay.innerText = 'Price: 45,00€';
                    if (m3PriceInput) m3PriceInput.value = '45,00€ Per person (VAT included)';

                    if (main2Select) {
                        main2Select.required = false;
                        main2Select.selectedIndex = 0;
                    }
                }
            });
        }

        const resForm = document.getElementById('resForm');
        if (resForm) {
            resForm.addEventListener('submit', function (e) {
                const activeBox = menuBoxes[menuSelect.value];
                Object.values(menuBoxes).forEach(box => {
                    if (box) {
                        box.querySelectorAll('input, select, textarea').forEach(input => {
                            input.disabled = true;
                        });
                    }
                });
                if (activeBox) {
                    activeBox.querySelectorAll('input, select, textarea').forEach(input => {
                        input.disabled = false;
                    });
                }
            });
        }
    }

    /* --- 7. SOLUCIÓN PARA RESETEAR FORMULARIO AL VOLVER ATRÁS (GITHUB PAGES) --- */
    window.addEventListener('pageshow', (event) => {
        // 'persisted' es true si la página se carga desde el caché (botón Atrás)
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            const resForm = document.getElementById('resForm');
            if (resForm) {
                // 1. Resetea todos los inputs de texto, fechas, etc.
                resForm.reset(); 

                // 2. Ejecutamos tu función interna para ocultar las cajas de menús y limpiar precios
                if (typeof resetMenuBoxes === "function") {
                    resetMenuBoxes();
                }

                // 3. Limpiamos manualmente el select de menús que se llena dinámicamente
                const menuSelect = document.getElementById('menuSelect');
                if (menuSelect) {
                    menuSelect.innerHTML = '<option value="" disabled selected>Choose a menu</option>';
                }
            }
        }
    });
});