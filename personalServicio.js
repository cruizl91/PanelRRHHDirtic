/**
 * personalServicio.js
 * Configuración final: Servicio, Funcionario, Teléfono (WhatsApp), IP/Anexo
 */

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('servicios-listado');
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRw5HG9JlAc0APnjCKGz6JF5XLRIdZpo0-dlolkRxfOXQzzOcmpEgEsPpTA4ME8Hte7t1giKHNAO8Ax/pub?gid=0&single=true&output=csv';

    /**
     * Formatea texto a "Nombre Propio"
     */
    const capitalizar = (texto) => {
        if (!texto) return "";
        return texto.toString().toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    };

    /**
     * Limpia el número de teléfono para que sea compatible con wa.me
     * Elimina espacios, guiones y asegura el código de país (56)
     */
    const formatearWhatsApp = (num) => {
        if (!num) return null;
        let limpio = num.toString().replace(/\D/g, ''); // Deja solo números
        // Si el número tiene 9 dígitos (formato Chile móvil), añadimos el 56
        if (limpio.length === 9) limpio = '56' + limpio;
        return `https://wa.me/${limpio}`;
    };

    const renderizar = (datos) => {
        const datosValidos = datos.filter(p => p['APELLIDOS Y NOMBRE'] && p['APELLIDOS Y NOMBRE'].toString().trim() !== "");

        if (datosValidos.length === 0) {
            contenedor.innerHTML = '<p class="status-msg">No hay personal registrado hoy.</p>';
            return;
        }

        // Estructura de Encabezados
        let html = `
            <div class="servicio-header" style="display: flex; justify-content: space-between; padding: 12px 15px; background-color: #f1f3f5; border-bottom: 2px solid #dee2e6; font-weight: bold; color: #495057; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">
                <div style="flex: 1.2;">Servicio</div>
                <div style="flex: 2.5;">Funcionario</div>
                <div style="flex: 1.5; text-align: center;">Teléfono</div>
                <div style="flex: 1.2; text-align: right;">IP/Anexo</div>
            </div>
        `;

        html += datosValidos.map(p => {
            const gradoYNombre = `${capitalizar(p['GRADO'])} ${capitalizar(p['APELLIDOS Y NOMBRE'])}`.trim();
            const servicio = p['SERVICIO'] ? p['SERVICIO'].toString().toUpperCase() : '---';
            const celularRaw = p['CELULAR'];
            const urlWhatsApp = formatearWhatsApp(celularRaw);
            const ipAnexo = p['IP/ANEXO'] || '---';

            return `
                <div class="servicio-row" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 15px; border-bottom: 1px solid #eee; background-color: #fff;">
                    
                    <div style="flex: 1.2; font-size: 0.8rem; color: #2E7D32; font-weight: 700;">
                        ${servicio}
                    </div>

                    <div style="flex: 2.5; font-size: 0.95rem; color: #333;">
                        ${gradoYNombre}
                    </div>

                    <div style="flex: 1.5; text-align: center;">
                        ${urlWhatsApp ? `
                            <a href="${urlWhatsApp}" target="_blank" rel="noopener noreferrer" 
                               style="color: #25D366; text-decoration: none; font-size: 0.9rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; background: #e9f7ef; padding: 5px 10px; border-radius: 20px; border: 1px solid #c3e6cb;">
                                <i class="fab fa-whatsapp"></i> ${celularRaw}
                            </a>
                        ` : `<span style="color: #ccc; font-size: 0.8rem;">---</span>`}
                    </div>

                    <div style="flex: 1.2; text-align: right; color: #007bff; font-weight: 700; font-size: 0.9rem;">
                        ${ipAnexo}
                    </div>
                </div>
            `;
        }).join('');

        contenedor.innerHTML = html;
    };

    const cargarExcel = () => {
        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => renderizar(results.data),
            error: () => {
                contenedor.innerHTML = '<p style="color:red; text-align:center;">Error de conexión.</p>';
            }
        });
    };

    cargarExcel();
});