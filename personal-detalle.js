document.addEventListener('DOMContentLoaded', () => {
    // CORRECCIÓN: Cambiamos 'personal.json' a 'funcionarios.json' para que coincida con el nombre del archivo de datos.
    const jsonPath = 'funcionarios.json'; 
    const personalTitle = document.getElementById('personal-title');
    const personalListArea = document.getElementById('personal-list-area');

    // 1. Obtener el nombre de la dependencia de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const dependencia = urlParams.get('dependencia');

    if (!dependencia) {
        personalTitle.textContent = "Error: No se especificó la dependencia.";
        personalListArea.innerHTML = '<p class="personal-card">Utilice el organigrama para navegar.</p>';
        return;
    }

    // 2. Cargar el archivo JSON
    function loadAndDisplayPersonal() {
        // Muestra el nombre de la dependencia mientras carga
        personalTitle.textContent = `Personal Asignado: ${dependencia.toUpperCase()}`;
        personalListArea.innerHTML = `<p class="personal-card">Cargando datos de ${dependencia}...</p>`;

        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    // Mantengo el mensaje de error para debug, pero ahora la ruta 'jsonPath' es correcta.
                    throw new Error('Error al cargar ' + jsonPath + ': ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                renderPersonal(data, dependencia);
            })
            .catch(error => {
                console.error("Error:", error);
                personalTitle.textContent = `Error al cargar personal para ${dependencia}`;
                personalListArea.innerHTML = `<p class="personal-card error-message">Problema de conexión con el archivo de datos (${jsonPath}). Asegúrese de que el archivo exista.</p>`;
            });
    }

    // 3. Renderizar el contenido de la dependencia seleccionada
    function renderPersonal(personalData, dependenciaNombre) {
        // Búsqueda (asegurando coincidencia sin importar mayúsculas/minúsculas)
        const depInfo = personalData.find(dep => dep.dependencia.toUpperCase() === dependenciaNombre.toUpperCase());

        personalListArea.innerHTML = ''; // Limpia el mensaje de carga

        const card = document.createElement('div');
        card.className = 'personal-card';
        
        const list = document.createElement('ul');
        list.className = 'funcionario-list';

        // Encabezado de la lista (Grado, Nombre, IP) - Reutilizando clases de organigrama.css
        const header = document.createElement('li');
        header.className = 'funcionario-header';
        header.innerHTML = '<span class="grado">Grado</span><span class="nombre">Nombre</span><span class="ip">IP</span>';
        list.appendChild(header);

        if (depInfo && depInfo.personal && depInfo.personal.length > 0) {
            
            depInfo.personal.forEach(func => {
                const item = document.createElement('li');
                item.className = 'funcionario-item';
                item.innerHTML = `
                    <span class="grado">${func.grado}</span>
                    <span class="nombre">${func.nombre}</span>
                    <span class="ip">${func.ip}</span>
                `;
                list.appendChild(item);
            });
            
        } else {
            // Mensaje si no hay personal o la dependencia no existe en el JSON
            const item = document.createElement('li');
            item.className = 'funcionario-item';
            item.innerHTML = '<span class="nombre" style="font-style: italic; color: #aaa; flex-grow: 1; text-align: center;">Sin personal asignado o datos no disponibles para esta sección.</span>';
            list.appendChild(item);
        }

        card.appendChild(list);
        personalListArea.appendChild(card);
    }

    // Inicia el proceso
    loadAndDisplayPersonal();
});