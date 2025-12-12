/**
 * Inicializa la funcionalidad del menú sándwich, 
 * esperando que el contenido dinámico del header (header.html) sea cargado.
 */
function initMenu() {
    // 1. Referencias a los elementos del DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.getElementById('main-nav');
    
    // ----------------------------------------------------
    // Verificación y Polling (La clave de la corrección)
    // ----------------------------------------------------
    if (!menuToggle || !sideMenu) {
        // Si los elementos no están presentes (debido a la carga asíncrona de include.js),
        // intentamos inicializar de nuevo después de 100 milisegundos.
        // Esto asegura que los listeners se adjunten SÓLO cuando el HTML esté listo.
        console.warn("Elementos de menú no encontrados. Reintentando inicialización...");
        setTimeout(initMenu, 100); 
        return; 
    }

    // Los elementos se han encontrado. Continuar con la inicialización.
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
            e.preventDefault();
            
            // Cierra el menú después de la selección
            sideMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');

            // Obtiene el ID del destino (ej: #plataformas)
            const targetId = this.getAttribute('href');
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
        });
    });
}

// Inicia el proceso de verificación e inicialización.
initMenu();