function buscarServicios(data){
    mostrarServicios(data);
}


// ===========================================
// 4. FUNCIÓN DE MOSTRAR HTML
// ===========================================
function mostrarServicios(lista) {
    const contenedor = document.getElementById('servicios-listado');
    if (!contenedor) return; 
    
    let html = '';

    if (lista.length === 0) {
        // Usa el estilo de p compartido con cumpleaños
        html = '<p>No hay información de Personal de Servicio.</p>';
    } else {
        // Se genera la lista <ul>, los estilos vendrán del CSS.
        html = '<ul>'; 
        
        lista.forEach(item => {
            if (item.fecha) {
                // Usa la clase para el encabezado (fecha), similar a .cumple-hoy
                html += `<li class="service-date-header">${item.fecha}</li>`;
            } 
            // Si el objeto tiene información de personal, la muestra
            else if (item.dotacion && item.nombre && item.ip) {
                // IMPORTANTE: Estructura de dos SPAN similar a cumpleaños
                html += `<li>
                            <span><strong>${item.dotacion}:</strong> ${item.nombre}</span>
                            <span>IP: ${item.ip}</span>
                        </li>`;
            }
        });
        
        html += '</ul>';
    }

    contenedor.innerHTML = html;
}

// ===========================================
// 5. FUNCIÓN PRINCIPAL DE CARGA DE DATOS
// ===========================================
function cargarPersonalServicios() {
    fetch('personalServicio.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar personalServicio.json: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            buscarServicios(data);
        })
        .catch(error => {
            console.error('Error:', error);
            const listado = document.getElementById('servicios-listado');
            if (listado) {
                 // Usa el estilo de p compartido con cumpleaños
                 listado.innerHTML = '<p style="color:red; padding: 10px;">Error: No se pudo cargar la lista de **Personal de Servicio**. Verifique el archivo JSON y la ruta.</p>';
            }
        });
}

// Iniciar la carga y búsqueda al cargar la página
cargarPersonalServicios();