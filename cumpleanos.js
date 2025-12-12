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
// NUEVA FUNCIÓN: 1.5. FUNCIÓN DE CÁLCULO DE EDAD
// ===========================================
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    // El argumento fechaNacimiento debe ser un objeto Date
    const nacimiento = fechaNacimiento;
    
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Si aún no ha pasado el mes de su cumpleaños o si es el mes pero el día de hoy es menor.
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}


const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const colorVerde = '#4CAF50'; 

// ===========================================
// 2. FUNCIÓN DE BÚSQUEDA Y LÓGICA DE FECHAS (MODIFICADA)
// ===========================================
function buscarCumpleanios(data) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    
    const cumpleaniosHoy = []; // NUEVA: Almacena los cumpleañeros de hoy
    const cumpleaniosProximos = [];

    data.forEach(persona => {
        
        // --- 1. VALIDACIÓN Y CORRECCIÓN DD-MM-YYYY ---
        const fechaOriginal = persona.fecha_nacimiento; 
        if (!fechaOriginal || typeof fechaOriginal !== 'string' || persona.nombre === null) return;
        
        const partesFecha = fechaOriginal.split('-'); 
        if (partesFecha.length !== 3) return;

        // Convierte a formato estándar MM/DD/YYYY
        // partesFecha[1] = mes, partesFecha[0] = dia, partesFecha[2] = año
        const fechaEstandar = partesFecha[1] + '/' + partesFecha[0] + '/' + partesFecha[2];
        const fechaNacimiento = new Date(fechaEstandar);

        if (isNaN(fechaNacimiento)) return; // Salta si la fecha es inválida
        
        const nombreFormateado = formatearNombre(persona.nombre);
        
        // ===========================================
        // NUEVA LÓGICA: IDENTIFICAR CUMPLEAÑOS DE HOY
        // ===========================================
        const diaNacimiento = fechaNacimiento.getDate();
        const mesNacimiento = fechaNacimiento.getMonth(); // 0-11
        
        if (hoy.getDate() === diaNacimiento && hoy.getMonth() === mesNacimiento) {
            const edad = calcularEdad(fechaNacimiento);
            cumpleaniosHoy.push({
                nombre: nombreFormateado,
                edad: edad
            });
            return; // Saltar el resto del bucle ya que fue capturado como cumpleaños de hoy.
        }
        // ===========================================
        
        
        // --- 2. PREPARACIÓN DE FECHA DE CUMPLEAÑOS (Lógica de próximos) ---
        const cumpleaniosEsteAnio = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
        cumpleaniosEsteAnio.setHours(0, 0, 0, 0);

        // Si el cumpleaños ya pasó este año, lo calcula para el próximo.
        if (cumpleaniosEsteAnio < hoy) {
            cumpleaniosEsteAnio.setFullYear(hoy.getFullYear() + 1);
        }
        
        // --- 3. CÁLCULO DE DÍAS Y FILTRADO ---
        const diffTime = Math.abs(cumpleaniosEsteAnio.getTime() - hoy.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Solo se agrega si está dentro del rango de anticipación (y no es hoy, lo cual ya se excluyó)
        if (diffDays <= DIAS_ANTICIPACION) {
             const dia = cumpleaniosEsteAnio.getDate();
             const mesIndex = cumpleaniosEsteAnio.getMonth();
             const mesNombre = meses[mesIndex];
             // Usamos item.dias para el estilo. diffDays será 0 si es hoy.
             const mensaje = `Cumpleaños en ${diffDays} día${diffDays !== 1 ? 's' : ''} (${dia} de ${mesNombre})`;
             
             cumpleaniosProximos.push({
                 nombre: nombreFormateado,
                 fecha: cumpleaniosEsteAnio,
                 dias: diffDays, // Debe ser 0 si es hoy, pero la lógica de arriba ya lo excluye
                 mensaje: mensaje
             });
        }
    });

    // 4. ORDENAR Y RENDERIZAR
    cumpleaniosProximos.sort((a, b) => a.dias - b.dias);
    
    // LLAMADA A LAS NUEVAS FUNCIONES DE RENDERIZADO
    mostrarCumpleaniosDeHoy(cumpleaniosHoy);
    
    // Llamada a la función original de próximos cumpleaños
    mostrarCumpleaniosProximos(cumpleaniosProximos);
}

// ===========================================
// NUEVA FUNCIÓN: 4.5. FUNCIÓN DE RENDERIZADO DE CUMPLEAÑOS DE HOY
// ===========================================
function mostrarCumpleaniosDeHoy(cumpleaniosHoy) {
    const contenedor = document.getElementById('cumpleanios-hoy-container');
    if (!contenedor) return;

    let html = '';
    const colorGrisClaro = '#F5F5F5'; // Un tono gris muy claro
    const colorTextoGrisOscuro = '#757575'; // Para el texto

    if (cumpleaniosHoy.length > 0) {
        // Hay cumpleaños hoy
        html += `<div style="
            background-color: ${colorGrisClaro}; 
            padding: 15px; 
            border-radius: 8px; 
            max-width: 80%; /* Para que se centre bien */
            margin: 0 auto 20px auto; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Sutil sombra */
        ">`;
        
        html += `<h3 style="
            margin: 0 0 10px 0; 
            color: ${colorTextoGrisOscuro}; 
            font-size: 1.2em;
        "><i class="fas fa-cake-candles" style="color: #FFC107;"></i> Cumpleaños de Hoy</h3>`;
        
        html += '<ul style="list-style: none; padding: 0; margin: 0;">';
        
        cumpleaniosHoy.forEach(persona => {
            html += `<li style="
                margin-bottom: 5px; 
                color: ${colorTextoGrisOscuro};
                font-size: 1.1em;
            ">
                <strong style="font-weight: bold;">${persona.nombre}</strong> cumple <span style="font-weight: bold;">${persona.edad} años</span>.
            </li>`;
        });
        
        html += '</ul>';
        html += '</div>';

    } else {
        // No hay cumpleaños hoy
        html += `<p style="
            background-color: ${colorGrisClaro};
            padding: 10px;
            border-radius: 8px;
            max-width: 80%;
            margin: 0 auto;
            color: ${colorTextoGrisOscuro}; 
            font-weight: bold; 
        ">
            Cumpleaños de Hoy: Ninguno
        </p>`;
    }

    contenedor.innerHTML = html;
}

// ===========================================
// 4. FUNCIÓN DE RENDERIZADO DE PRÓXIMOS CUMPLEAÑOS (Original, renombrada para claridad)
// ===========================================
function mostrarCumpleaniosProximos(cumpleaniosProximos) {
    const contenedor = document.getElementById('cumpleanios-listado');
    if (!contenedor) return;

    let html = '';

    if (cumpleaniosProximos.length === 0) {
        html = '<p style="padding: 10px 15px;">No hay próximos cumpleaños dentro de los ' + DIAS_ANTICIPACION + ' días.</p>';
    } else {
        html = '<ul class="cumpleanios-list">';
        cumpleaniosProximos.forEach(item => {
            // La lógica de 'item.dias === 0' ya no debería usarse, ya que el cumpleaños de hoy se maneja por separado.
            // Mantenemos la lógica original por si el día 0 aún se pasa por algún caso, aunque en principio `diffDays` será >= 1.
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
                 listado.innerHTML = '<p style="color:red; padding: 10px 15px;">No se pudo cargar la lista de cumpleaños.</p>';
            }
        });
}

// Ejecución al cargar el script
document.addEventListener('DOMContentLoaded', cargarDatosCumpleanios);