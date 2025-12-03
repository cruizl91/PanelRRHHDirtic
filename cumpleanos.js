// Nombre del archivo: cumpleanios.js (VERSIÓN FINAL CON FORMATO DE NOMBRE)

const DIAS_ANTICIPACION = 7; 

// ===========================================
// FUNCIÓN NUEVA: FORMATO TÍTULO DE NOMBRES
// ===========================================
function formatearNombre(nombre) {
    if (!nombre || typeof nombre !== 'string') return '';
    
    // 1. Convertir todo a minúsculas
    const minusculas = nombre.toLowerCase();

    // 2. Usar una expresión regular para encontrar el inicio de cada palabra (\b)
    // y convertir la primera letra a mayúscula (toUpperCase)
    // También maneja los acentos y caracteres especiales dentro de las palabras
    const formatoTitulo = minusculas.replace(/\b[a-z\u00C0-\u017F]/g, char => char.toUpperCase());
    
    return formatoTitulo;
}


function buscarCumpleanios(data) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    
    const cumpleaniosProximos = [];

    data.forEach(persona => {
        
        // **CORRECCIÓN CLAVE PARA DD-MM-YYYY**
        const fechaOriginal = persona.fecha_nacimiento; 
        
        if (!fechaOriginal || typeof fechaOriginal !== 'string') return;
        
        const partesFecha = fechaOriginal.split('-'); 
        if (partesFecha.length !== 3) return;

        // Formato estándar MM/DD/YYYY:
        const fechaEstandar = partesFecha[1] + '/' + partesFecha[0] + '/' + partesFecha[2]; 
        
        const fechaNacimiento = new Date(fechaEstandar);
        
        if (isNaN(fechaNacimiento)) {
             console.warn(`Fecha inválida ignorada para ${persona.nombre}: ${fechaOriginal}`);
             return; 
        }
        // **FIN DE CORRECCIÓN CLAVE**
        
        // 1. Crear la fecha del cumpleaños para este AÑO
        const fechaCumpleanios = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
        
        // 2. Calcular la diferencia en días
        const diferenciaMs = fechaCumpleanios.getTime() - hoy.getTime();
        const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
        
        
        // --- LÓGICA PARA RECALCULAR SI EL CUMPLEAÑOS YA PASÓ ---
        let diasFinal = diferenciaDias;
        if (diferenciaDias < 0) {
             const proximoAnio = hoy.getFullYear() + 1;
             const fechaCumpleaniosProximo = new Date(proximoAnio, fechaNacimiento.getMonth(), fechaNacimiento.getDate());
             const diferenciaMsProximo = fechaCumpleaniosProximo.getTime() - hoy.getTime();
             diasFinal = Math.ceil(diferenciaMsProximo / (1000 * 60 * 60 * 24));
        }
        
        // --- AGREGAR A LA LISTA SI ESTÁ EN EL RANGO ---
        if (diasFinal >= 0 && diasFinal <= DIAS_ANTICIPACION) {
             // Procesar y agregar al array con el nombre formateado
             procesarCumpleanios(formatearNombre(persona.nombre), diasFinal, cumpleaniosProximos);
        }
    });

    cumpleaniosProximos.sort((a, b) => a.dias - b.dias);
    mostrarCumpleanios(cumpleaniosProximos);
}

// ... (El resto de las funciones procesarCumpleanios, mostrarCumpleanios y cargarDatosCumpleanios se mantienen iguales)
function procesarCumpleanios(nombre, diferenciaDias, lista) {
    let mensaje;
    if (diferenciaDias === 0) {
        mensaje = "¡Es hoy!";
    } else if (diferenciaDias === 1) {
        mensaje = "¡Mañana!";
    } else {
        mensaje = `En ${diferenciaDias} días`;
    }
    lista.push({ nombre: nombre, dias: diferenciaDias, mensaje: mensaje });
}

function mostrarCumpleanios(lista) {
    const contenedor = document.getElementById('cumpleanios-listado');
    if (!contenedor) return; 
    
    let html = '';

    if (lista.length === 0) {
        html = '<p style="color:#666; padding: 10px;">No hay cumpleaños cercanos en los próximos 7 días.</p>';
    } else {
        html = '<ul style="list-style: none; padding-left: 0; margin-top: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">';
        lista.forEach(item => {
            const colorVerde = 'var(--verde, #088024)'; 
            const estilo = item.dias === 0 ? `style="font-weight: bold; color: ${colorVerde}; background-color: #e6ffe6; padding: 10px 15px; border-bottom: 1px solid #eee;"` : 'style="background: #fff; padding: 10px 15px; border-bottom: 1px solid #eee;"';
            html += `<li ${estilo}>${item.nombre} <span style="float: right;">${item.mensaje}</span></li>`;
        });
        html += '</ul>';
    }

    contenedor.innerHTML = html;
}

function cargarDatosCumpleanios() {
    fetch('cumpleanos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar cumpleanos.json: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            buscarCumpleanios(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('cumpleanios-listado').innerHTML = 
                '<p style="color:red; padding: 10px;">Error: No se pudo cargar la lista de cumpleaños. Verifique el archivo JSON y la ruta.</p>';
        });
}

cargarDatosCumpleanios();