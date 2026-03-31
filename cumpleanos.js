/**
 * CONFIGURACIÓN DE LA BASE DE DATOS COMPARTIDA
 */
const URL_SHEET_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTptIIW77JHIFq3xEONR-BqZG0KKE-SkgtDbpsGpPN8QS68MWIpoG6whqdbDxIXHSwKlJrBWomfCZqo/pub?output=csv'; // URL de publicación CSV
const DIAS_ANTICIPACION = 7;
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/**
 * FUNCIÓN PRINCIPAL: Carga y mapeo dinámico
 */
async function cargarDatosCumpleanios() {
    try {
        const response = await fetch(URL_SHEET_CSV);
        const csvText = await response.text();
        
        // Separar por líneas y limpiar espacios
        const lineas = csvText.split(/\r?\n/);
        if (lineas.length < 2) return;

        // Detectar índices de columnas dinámicamente
        const cabecera = lineas[0].split(',').map(h => h.trim().toLowerCase());
        const idx = {
            nombre: cabecera.indexOf('nombre'),
            grado: cabecera.indexOf('grado'),
            fecha: cabecera.indexOf('fecha_nacimiento'),
            dep: cabecera.indexOf('dependencia')
        };

        // Procesar solo si las columnas esenciales existen
        const personal = lineas.slice(1).map(linea => {
            const columnas = linea.split(',');
            return {
                nombre: columnas[idx.nombre],
                grado: columnas[idx.grado],
                fecha_nacimiento: columnas[idx.fecha],
                dependencia: columnas[idx.dep]
            };
        }).filter(p => p.nombre && p.fecha_nacimiento);

        procesarCumpleanios(personal);
    } catch (error) {
        console.error('Error en BD compartida:', error);
    }
}

/**
 * LÓGICA DE NEGOCIO (Igual a la anterior pero optimizada)
 */
function procesarCumpleanios(data) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const listadoFinal = [];

    data.forEach(p => {
        const nacimiento = parsearFecha(p.fecha_nacimiento);
        if (!nacimiento) return;

        const nMes = nacimiento.getMonth();
        const nDia = nacimiento.getDate();
        
        let cumpleActual = new Date(hoy.getFullYear(), nMes, nDia);
        if (cumpleActual < hoy) cumpleActual.setFullYear(hoy.getFullYear() + 1);

        const diffMs = cumpleActual - hoy;
        const diasFaltantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diasFaltantes <= DIAS_ANTICIPACION) {
            const edadFutura = calcularEdad(nacimiento) + (diasFaltantes === 0 ? 0 : 1);
            
            listadoFinal.push({
                nombreFull: `${formatearTexto(p.grado)} ${formatearTexto(p.nombre)}`.trim(),
                dias: diasFaltantes,
                fechaTxt: `${nDia} de ${meses[nMes]}`,
                edad: edadFutura
            });
        }
    });

    listadoFinal.sort((a, b) => a.dias - b.dias);
    dibujarInterfaz(listadoFinal);
}

// --- Helpers Auxiliares ---
function parsearFecha(str) {
    if (!str) return null;
    const d = str.split(/[-/]/); // Soporta 15-03-1990 o 15/03/1990
    return d.length === 3 ? new Date(d[2], d[1]-1, d[0]) : null;
}

function calcularEdad(nac) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) edad--;
    return edad;
}

function formatearTexto(t) {
    return t ? t.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()) : '';
}

function dibujarInterfaz(lista) {
    const hoyCont = document.getElementById('cumpleanios-hoy-container');
    const proxCont = document.getElementById('cumpleanios-listado');
    
    const hoy = lista.filter(i => i.dias === 0);
    const prox = lista.filter(i => i.dias > 0);

    // Renderizado de HOY
    hoyCont.innerHTML = hoy.map(i => `
        <div class="card-hoy">
            <h3>¡FELIZ CUMPLEAÑOS!</h3>
            <p>${i.nombreFull} (${i.edad} años)</p>
        </div>
    `).join('');

    // Renderizado de PRÓXIMOS
    proxCont.innerHTML = prox.map(i => `
        <div class="fila-cumple">
            <span>${i.nombreFull}</span>
            <small>El ${i.fechaTxt} (en ${i.dias} días)</small>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', cargarDatosCumpleanios);