const DIAS_ANTICIPACION = 7; 
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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

// Función formatearGrado se mantuvo, aunque no se usa en este código para este archivo, 
// se mantiene por si se usa en otro contexto.
function formatearGrado(grado) {
    if (!grado || typeof grado !== 'string') return '';
    const minusculas = grado.toLowerCase();
    // Reemplaza el inicio de cada palabra con su versión en mayúscula
    const formatoTitulo = minusculas.replace(/\b[a-z\u00C0-\u017F]/g, char => char.toUpperCase());
    return formatoTitulo;
}

// ===========================================
// 2. FUNCIÓN DE PARSEO DE FECHA
// ===========================================
// Convierte la cadena "DD-MM-YYYY" a un objeto Date válido.
function parsearFecha(fechaStr) {
    if (!fechaStr || typeof fechaStr !== 'string' || fechaStr.length < 10) {
        return null;
    }
    const partes = fechaStr.split('-');
    
    if (partes.length !== 3) {
        return null; 
    }
    
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // JS usa meses base 0
    const anio = parseInt(partes[2], 10);
    
    const fecha = new Date(anio, mes, dia);

    if (isNaN(fecha.getTime())) {
        return null; 
    }

    return fecha;
}

// ===========================================
// 3. FUNCIÓN DE CÁLCULO DE EDAD
// ===========================================
function calcularEdad(fechaNacimientoDate) {
    const hoy = new Date();
    const nacimiento = fechaNacimientoDate;
    
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();

    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}


// ===========================================
// 4. FUNCIÓN PRINCIPAL DE BÚSQUEDA Y LÓGICA
// ===========================================
function buscarCumpleanios(data) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    
    const listadoCumpleanios = [];

    data.forEach(dependenciaObj => {
        if (!dependenciaObj.personal) return;
        
        dependenciaObj.personal.forEach(funcionario => {
            
            const fechaNacimientoStr = funcionario.fecha_nacimiento; 
            const nacimiento = parsearFecha(fechaNacimientoStr);
            
            if (!nacimiento) {
                return; 
            }
            
            const nacimientoMes = nacimiento.getMonth();
            const nacimientoDia = nacimiento.getDate();
            
            let cumpleaniosActual = new Date(hoy.getFullYear(), nacimientoMes, nacimientoDia);
            cumpleaniosActual.setHours(0, 0, 0, 0); 

            // Si el cumpleaños ya pasó este año, se establece para el próximo año
            if (cumpleaniosActual.getTime() < hoy.getTime()) {
                cumpleaniosActual.setFullYear(hoy.getFullYear() + 1);
            }

            // Cálculo de la diferencia de días
            const msPorDia = 1000 * 60 * 60 * 24;
            let diferenciaDias = Math.ceil((cumpleaniosActual.getTime() - hoy.getTime()) / msPorDia);

            if (diferenciaDias > 365) {
                diferenciaDias = diferenciaDias - 365;
            }

            // Solo incluimos si está dentro del rango (hoy o próximos DIAS_ANTICIPACION)
            if (diferenciaDias <= DIAS_ANTICIPACION) {
                
                // La edad futura es la edad actual + 1 si el cumpleaños no es hoy
                const edadFutura = calcularEdad(nacimiento) + (diferenciaDias === 0 ? 0 : 1);
                
                let mensaje = `Cumple el ${nacimientoDia} de ${meses[nacimientoMes]}`;
                
                if (diferenciaDias === 0) {
                    mensaje = `¡CUMPLEAÑOS HOY! ${edadFutura} años`;
                } else if (diferenciaDias === 1) {
                    mensaje += ` (Mañana)`;
                } else {
                    mensaje += ` (en ${diferenciaDias} días)`;
                }

                listadoCumpleanios.push({
                    nombre: formatearNombre(funcionario.nombre),
                    dias: diferenciaDias,
                    mensaje: mensaje,
                    dependencia: dependenciaObj.dependencia, 
                    grado: funcionario.grado,
                    edad: edadFutura // La edad ya está aquí
                });
            }
        });
    });

    // Ordenar: Hoy (0), Mañana (1), y luego por días restantes
    listadoCumpleanios.sort((a, b) => a.dias - b.dias);

    // Mostrar el listado
    mostrarListado(listadoCumpleanios);
}

// ===========================================
// 5. FUNCIÓN DE MOSTRAR EL LISTADO EN HTML
// ===========================================
function mostrarListado(listado) {
    const contenedor = document.getElementById('cumpleanios-listado');
    const hoyContainer = document.getElementById('cumpleanios-hoy-container');
    
    if (!contenedor || !hoyContainer) return;

    let htmlProximos = '';
    const cumpleaniosHoy = listado.filter(item => item.dias === 0);
    // Filtrar los cumpleaños de hoy de la lista de Próximos Cumpleaños
    const proximosCumpleanios = listado.filter(item => item.dias > 0); 
    
    // 5.1. Mostrar mensaje de cumpleaños de HOY (bloque superior)
    if (cumpleaniosHoy.length > 0) {
        let mensajeHoy = cumpleaniosHoy.map(item => 
            // CORRECCIÓN: Se añade item.edad entre paréntesis al listado superior
            `<span class="hoy-funcionario">${item.grado ? item.grado + ' ' : ''}${item.nombre} (${item.edad} años)</span><br>`
        ).join('');

        hoyContainer.innerHTML = `
            <div class="cumpleanios-hoy-card">
                <span class="hoy-titulo">¡FELIZ CUMPLEAÑOS!</span>
                <div class="hoy-listado">
                    ${mensajeHoy}
                </div>
            </div>
        `;
    } else {
         hoyContainer.innerHTML = '';
    }

    // 5.2. Mostrar lista de Próximos Cumpleaños
    if (proximosCumpleanios.length === 0) {
        htmlProximos = '<p style="padding: 10px; text-align: center; color: #666;">No hay próximos cumpleaños en los siguientes 7 días.</p>';
    } else {
        htmlProximos = '<ul style="list-style-type: none; padding: 0; margin: 0;">';
        proximosCumpleanios.forEach(item => {
            // Muestra Grado y Nombre, sin la dependencia.
            const nombreCompleto = `${item.grado ? item.grado + ' ' : ''}${item.nombre}`;

            htmlProximos += `<li style="background: #fff; padding: 10px 15px; border-bottom: 1px solid #eee;">
                                 <span>${nombreCompleto}</span> 
                                 <span>${item.mensaje}</span>
                             </li>`;
        });
        htmlProximos += '</ul>';
    }

    contenedor.innerHTML = htmlProximos;
}

// ===========================================
// 6. FUNCIÓN PRINCIPAL DE CARGA DE DATOS
// ===========================================
function cargarDatosCumpleanios() {
    fetch('funcionarios.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar funcionarios.json: ' + response.statusText);
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
                 listado.innerHTML = `<p style="color: red; padding: 10px;">Error al cargar los datos: ${error.message}. Revise la consola del navegador.</p>`;
            }
        });
}

// Iniciar la carga de datos al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosCumpleanios);