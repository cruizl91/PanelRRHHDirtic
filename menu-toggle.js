/**
 * Inicializa la funcionalidad del menú sándwich.
 * Esta función es llamada por include.js cuando el header (header.html) es insertado.
 */
function initializeMenuToggle() { // <-- FUNCIÓN RENOMBRADA
    // 1. Referencias a los elementos del DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.getElementById('main-nav');
    
    if (!menuToggle || !sideMenu) {
        console.error("No se pudieron encontrar los elementos del menú después de la carga del header.");
        return; 
    }

    console.log("Menú inicializado correctamente.");
    const menuItems = sideMenu.querySelectorAll('.menu-item');
    
    // ----------------------------------------------------
    // 2. Manejo del estado del menú (abrir/cerrar)
    // ----------------------------------------------------
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        // Alterna las clases para mostrar/ocultar y actualiza el atributo de accesibilidad
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        sideMenu.classList.toggle('open');
    });

    // ----------------------------------------------------
    // 3. Manejo de la navegación (scroll suave con offset fijo)
    // ----------------------------------------------------
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // **CORRECCIÓN CLAVE:** Solo prevenimos la acción predeterminada
            // (navegación) para los enlaces internos (los que empiezan con '#').
            if (targetId.startsWith('#')) { 
                e.preventDefault();
                
                // Cierra el menú después de la selección
                sideMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // --- Cálculo del desplazamiento ---
                    
                    // Obtiene la altura del encabezado fijo para calcular el offset
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    
                    // Calcula la posición del destino menos la altura del encabezado fijo.
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    // Desplazamiento suave usando la API de scroll
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // Si no empieza con '#', como "organigrama.html", se permite la navegación normal.
        });
    });
}

// No se llama a la función aquí; será llamada por include.js.