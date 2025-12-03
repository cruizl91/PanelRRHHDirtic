const DIAS_ANTICIPACION = 7; 

// ===========================================
// 1. FUNCIÓN DE FORMATO (Mayúscula Inicial)
// ===========================================
function formatearNombre(nombre) {
    if (!nombre || typeof nombre !== 'string') return '';
    const minusculas = nombre.toLowerCase();
    // Reemplaza el inicio de cada palabra con su versión en mayúscula
    const formatoTitulo = minusculas.replace(/\b[a-z\u00C0-\u017F]/g, char => char.toUpperCase());
    return formatoTitulo;
}


// ===========================================
// 2. FUNCIÓN DE BÚSQUEDA Y LÓGICA DE FECHAS
// ===========================================
function buscarCumpleanios(data) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    
    const cumpleaniosProximos = [];

    data.forEach(persona => {
        
        // --- 1. VALIDACIÓN Y CORRECCIÓN DD-MM-YYYY ---
        const fechaOriginal = persona.fecha_nacimiento; 
        if (!fechaOriginal || typeof fechaOriginal !== 'string' || persona.nombre === null) return;
        
        const partesFecha = fechaOriginal.split('-'); 
        if (partesFecha.length !== 3) return;

        // Convierte a formato estándar MM/DD/YYYY
        const fechaEstandar = partesFecha[1] + '/' + partesFecha[0] + '/' + partesFecha[2]; 
        const fechaNacimiento = new Date(fechaEstandar);
        
        if (isNaN(fechaNacimiento)) {
             console.warn(`Fecha inválida ignorada para ${persona.nombre}: ${fechaOriginal}`);
             return; 
        }
        
        // --- 2. FORMATO DE FECHA PARA MOSTRAR ---
        const opcionesFechaDisplay = { day: 'numeric', month: 'long' };
        // Esto genera la cadena "22 de diciembre"
        const fechaDisplay = fechaNacimiento.toLocaleDateString('es-CL', opcionesFechaDisplay);
        
        
        // --- 3. CÁLCULO DE DÍAS RESTANTES (EVITANDO DUPLICACIÓN) ---
        
        // A. Calcular el cumpleaños para el AÑO ACTUAL
        let fechaCumpleanios = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
        let diferenciaMs = fechaCumpleanios.getTime() - hoy.getTime();
        let diasFinal = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
        
        
        // B. CORREGIR: Si el cumpleaños ya pasó este año (díasFinal < 0), calculamos el próximo año
        if (diasFinal < 0) {
             const proximoAnio = hoy.getFullYear() + 1;
             fechaCumpleanios = new Date(proximoAnio, fechaNacimiento.getMonth(), fechaNacimiento.getDate());
             diferenciaMs = fechaCumpleanios.getTime() - hoy.getTime();
             diasFinal = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
        }

        
        // --- 4. VERIFICAR Y AGREGAR A LA LISTA ---
        if (diasFinal >= 0 && diasFinal <= DIAS_ANTICIPACION) {
             // La función procesarCumpleanios se llama UNA SOLA VEZ
             procesarCumpleanios(formatearNombre(persona.nombre), diasFinal, cumpleaniosProximos, fechaDisplay);
        }
    });

    cumpleaniosProximos.sort((a, b) => a.dias - b.dias);
    mostrarCumpleanios(cumpleaniosProximos);
}

// ===========================================
// 3. FUNCIÓN DE PROCESAMIENTO (Manejo de Mensajes)
// ===========================================
// Se incluyó el nuevo parámetro 'fechaDisplay'
function procesarCumpleanios(nombre, diferenciaDias, lista, fechaDisplay) { 
    let mensaje;
    
    if (diferenciaDias === 0) {
        // Hoy
        mensaje = "¡Es hoy!";
    } else if (diferenciaDias === 1) {
        // Mañana
        mensaje = `¡Mañana! (${fechaDisplay})`;
    } else {
        // Próximos días
        mensaje = `En ${diferenciaDias} días (${fechaDisplay})`;
    }
    
    // El .push ocurre aquí:
    lista.push({ nombre: nombre, dias: diferenciaDias, mensaje: mensaje });
}


// ===========================================
// 4. FUNCIÓN DE MOSTRAR HTML
// ===========================================
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
            
            // Nota: Aquí se usa item.mensaje, que ya incluye el formato de fecha (DD de mes)
            html += `<li ${estilo}>${item.nombre} <span>${item.mensaje}</span></li>`;
        });
        html += '</ul>';
    }

    contenedor.innerHTML = html;
}

// ===========================================
// 5. FUNCIÓN PRINCIPAL DE CARGA DE DATOS
// ===========================================
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
            const listado = document.getElementById('cumpleanios-listado');
            if (listado) {
                 listado.innerHTML = '<p style="color:red; padding: 10px;">Error: No se pudo cargar la lista de cumpleaños. Verifique el archivo JSON y la ruta.</p>';
            }
        });
}

// Iniciar la carga y búsqueda al cargar la página
cargarDatosCumpleanios();