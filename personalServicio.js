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
        html = '<p style="color:#666; padding: 10px;">No hay información de Personal de Servicio.</p>';
    } else {
        html = '<ul style="list-style: none; padding-left: 0; margin-top: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">';
        
        lista.forEach(item => {
            // Verifica si el objeto tiene la clave "fecha" para usar un estilo diferente (título)
            if (item.fecha) {
                // Estilo para la fecha/encabezado
                html += `<li style="font-weight: bold; color: #088024; background-color: #e6ffe6; padding: 10px 15px; border-bottom: 1px solid #088024; margin-top: 10px;">${item.fecha}</li>`;
            } 
            // Si el objeto tiene información de personal, la muestra
            else if (item.dotacion && item.nombre && item.ip) {
                // Estilo para el personal de servicio
                const estilo = 'style="background: #fff; padding: 10px 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;"';
                
                html += `<li ${estilo}>
                            <div><strong>${item.dotacion}:</strong> ${item.nombre}</div>
                            <div style="font-style: italic; color: #555;">IP: ${item.ip}</div>
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
                 // Corregir el mensaje de error:
                 listado.innerHTML = '<p style="color:red; padding: 10px;">Error: No se pudo cargar la lista de **Personal de Servicio**. Verifique el archivo JSON y la ruta.</p>';}
        });
}

// Iniciar la carga y búsqueda al cargar la página
cargarPersonalServicios();