// Nombre del archivo: fecha-hora.js

function actualizarFechaHora() {
    const ahora = new Date();

    // Opciones para formatear la fecha (ej: "miércoles, 3 de diciembre de 2025")
    const opcionesFecha = {
        weekday: 'long', 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
    };

    // Opciones para formatear la hora (ej: "10:21:48")
    const opcionesHora = {
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };

    // Usamos 'es-CL' (español de Chile) o simplemente 'es' para español
    const fechaFormateada = ahora.toLocaleDateString('es-CL', opcionesFecha);
    const horaFormateada = ahora.toLocaleTimeString('es-CL', opcionesHora);

    // Formato de presentación: Fecha | Hora
    const display = `${fechaFormateada} | ${horaFormateada}`;

    const elementoFechaHora = document.getElementById('fecha-hora');
    if (elementoFechaHora) {
        elementoFechaHora.textContent = display;
    }
}

// Ejecutar la función inmediatamente al cargar la página
actualizarFechaHora();

// Configurar la función para que se repita cada 1000 milisegundos (1 segundo)
setInterval(actualizarFechaHora, 1000);