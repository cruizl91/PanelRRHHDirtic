/**
 * Función para cargar contenido de un archivo en un elemento placeholder.
 * @param {string} url - Ruta al archivo HTML (ej: 'header.html')
 * @param {string} targetId - ID del elemento donde se insertará el contenido (ej: 'header-placeholder')
 */
function loadHTML(url, targetId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // 1. Inserta el contenido HTML en el placeholder
            document.getElementById(targetId).innerHTML = data;
            
            // 2. Ejecuta la función de inicialización del menú SÓLO después de insertar el header
            if (targetId === 'header-placeholder' && typeof initializeMenuToggle === 'function') {
                initializeMenuToggle();
            }
        })
        .catch(error => {
            console.error(`Error cargando el archivo ${url}:`, error);
        });
}

// Cargar el header y el footer al cargar la página
window.onload = function() {
    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');
};