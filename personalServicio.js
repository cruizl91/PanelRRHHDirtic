function buscarServicios(data){
    mostrarServicios(data);
}

function mostrarServicios(lista) {
    const contenedor = document.getElementById('servicios-listado');
    if (!contenedor) return; 
    
    let html = '';

    if (lista.length === 0) {
        html = '<p>No hay información de Personal de Servicio.</p>';
    } else {
        html = '<ul>'; 
        
        lista.forEach(item => {
            if (item.fecha) {
                html += `<li class="service-date-header">${item.fecha}</li>`;
            } 
            else if (item.dotacion && item.nombre) {
                // CAMBIO: Se agregó el span de Teléfono entre el nombre y la IP
                html += `<li>
                            <span class="service-main"><strong>${item.dotacion}:</strong> ${item.nombre}</span>
                            <span class="service-tel">Teléfono: ${item.telefono || 'N/A'}</span>
                            <span class="service-ip">IP: ${item.ip}</span>
                        </li>`;
            }
        });
        
        html += '</ul>';
    }

    contenedor.innerHTML = html;
}

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
                 listado.innerHTML = '<p style="color:red; padding: 10px;">Error: No se pudo cargar la lista de **Personal de Servicio**. Verifique el archivo JSON y la ruta.</p>';
            }
        });
}

cargarPersonalServicios();