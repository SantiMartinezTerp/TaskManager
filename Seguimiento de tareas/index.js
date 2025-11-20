
        let tasks = [
            {id: 1, store: 'GRANADA', observation: 'Estan muy pobres de tabacos, nada de vapeadores ni cigarrillos', responsible: 'Juli', date: '2025-12-01', solution: 'Hoy se hace la llamada', completed: false},
            {id: 2, store: 'GRANADA', observation: 'Aquí debería estar Amarillo y Antioqueño (Se debe revisar)', responsible: 'Nico', date: '2025-01-01', solution: 'Hasta el otro año, problemas', completed: false},
            {id: 3, store: 'GRANADA', observation: 'Está haciendo falta los productos de aseo personal', responsible: 'Juli', date: '2025-12-20', solution: 'Hoy se envía hablar con karen', completed: false},
            {id: 4, store: 'GRANADA', observation: 'No le aparece OTC en AXIONLOG', responsible: 'Nico', date: '', solution: 'Javier', completed: false},
            {id: 5, store: 'GRANADA', observation: 'Hay una góndola de más, y no tienen planograma', responsible: 'Fredy', date: '', solution: '', completed: false},
            {id: 6, store: 'TDC BONANZA', observation: 'No está apareciendo en ATC manis familiares', responsible: 'Maic', date: '', solution: '', completed: false},
            {id: 7, store: 'TDC BONANZA', observation: 'Necesario codigo de hatsu granada, mora azul. Ya se preguntó', responsible: 'Maic', date: '', solution: '', completed: false},
            {id: 8, store: 'TDC BONANZA', observation: 'Dani, el néctar de vidrio no viene mas en la presentación del planograma (Está llegando otra referencia) ¿está aprobado?', responsible: 'Dani', date: '2025-11-20', solution: '', completed: false},
            {id: 9, store: 'TDC BONANZA', observation: 'Ahora que codificamos el Kumis, no aparece tampoco en planimetria', responsible: 'Fredy', date: '', solution: '', completed: false},
            {id: 10, store: 'Tienda Autopista', observation: 'La tienda no tiene contacto de GeekBar, importante que desde abastecimiento podamos entregar estos contactos para los pedidos', responsible: 'Juli', date: '2025-12-20', solution: 'Este producto llega por AXL, se debe pedir por AXL no tienen', completed: false}
        ];
        
        let nextId = 11;
        let editingTaskId = null;
        let customStores = new Set();

        function toggleNewStoreInput() {
            const select = document.getElementById('taskStore');
            const newStoreGroup = document.getElementById('newStoreGroup');
            const newStoreInput = document.getElementById('newStoreName');
            
            if (select.value === '__new__') {
                newStoreGroup.style.display = 'block';
                newStoreInput.required = true;
            } else {
                newStoreGroup.style.display = 'none';
                newStoreInput.required = false;
                newStoreInput.value = '';
            }
        }

        function getStoreClass(store) {
            const classes = {
                'GRANADA': 'store-granada',
                'TDC BONANZA': 'store-bonanza',
                'Tienda Autopista': 'store-autopista',
                'Tienda Chipichape': 'store-chipichape',
                'Tienda Altoque Plazas Verdes': 'store-altoque',
                'Tienes Portal MENGA': 'store-menga',
                'Tienda MENGA': 'store-menga-2'
            };
            return classes[store] || 'store-custom';
        }

        function formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr + 'T00:00:00');
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        function renderTasks() {
            const searchTerm = document.getElementById('searchBox').value.toLowerCase();
            const filterStore = document.getElementById('filterStore').value;
            const filterStatus = document.getElementById('filterStatus').value;

            let filteredTasks = tasks.filter(task => {
                const matchSearch = task.observation.toLowerCase().includes(searchTerm) ||
                                  (task.responsible || '').toLowerCase().includes(searchTerm) ||
                                  (task.solution || '').toLowerCase().includes(searchTerm);
                const matchStore = !filterStore || task.store === filterStore;
                const matchStatus = !filterStatus || 
                                  (filterStatus === 'completed' && task.completed) ||
                                  (filterStatus === 'pending' && !task.completed);
                return matchSearch && matchStore && matchStatus;
            });

            const stores = [...new Set(filteredTasks.map(t => t.store))];
            const grid = document.getElementById('storesGrid');
            
            grid.innerHTML = stores.map(store => {
                const storeTasks = filteredTasks.filter(t => t.store === store);
                return `
                    <div class="store-card">
                        <div class="store-header ${getStoreClass(store)}">
                            <span>${store}</span>
                            <span class="task-count">${storeTasks.length} tareas</span>
                        </div>
                        <div class="tasks-list">
                            ${storeTasks.length > 0 ? storeTasks.map(task => `
                                <div class="task-item ${task.completed ? 'completed' : ''}">
                                    <div class="task-header">
                                        <div class="checkbox-wrapper">
                                            <input type="checkbox" class="checkbox" 
                                                   ${task.completed ? 'checked' : ''}
                                                   onchange="toggleTask(${task.id})">
                                        </div>
                                        <div class="task-content">
                                            <div class="task-observation">${task.observation}</div>
                                            <div class="task-meta">
                                                ${task.responsible ? `<div class="meta-item"><span class="meta-label">👤</span> ${task.responsible}</div>` : ''}
                                                ${task.date ? `<div class="meta-item"><span class="meta-label">📅</span> ${formatDate(task.date)}</div>` : ''}
                                            </div>
                                            ${task.solution ? `<div class="task-solution">💡 <strong>Solución:</strong> ${task.solution}</div>` : ''}
                                            <div class="task-actions">
                                                <button class="btn-small btn-edit" onclick="editTask(${task.id})">✏️ Editar</button>
                                                <button class="btn-small btn-delete" onclick="deleteTask(${task.id})">🗑️ Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : '<div class="empty-state">No hay tareas para mostrar</div>'}
                            <button class="add-task-btn" onclick="openAddModal('${store}')">➕ Agregar tarea</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
            }
        }

        function deleteTask(id) {
            if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                tasks = tasks.filter(t => t.id !== id);
                renderTasks();
            }
        }

        function openAddModal(store = '') {
            editingTaskId = null;
            document.getElementById('modalTitle').textContent = 'Nueva Tarea';
            document.getElementById('taskForm').reset();
            if (store) document.getElementById('taskStore').value = store;
            document.getElementById('taskModal').classList.add('active');
        }

        function editTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                editingTaskId = id;
                document.getElementById('modalTitle').textContent = 'Editar Tarea';
                document.getElementById('taskStore').value = task.store;
                document.getElementById('taskObservation').value = task.observation;
                document.getElementById('taskResponsible').value = task.responsible || '';
                document.getElementById('taskDate').value = task.date || '';
                document.getElementById('taskSolution').value = task.solution || '';
                document.getElementById('taskModal').classList.add('active');
            }
        }

        function closeModal() {
            document.getElementById('taskModal').classList.remove('active');
            editingTaskId = null;
        }

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            let storeName = document.getElementById('taskStore').value;
            
            // Si seleccionó nueva tienda, usar el nombre personalizado
            if (storeName === '__new__') {
                storeName = document.getElementById('newStoreName').value.trim();
                if (!storeName) {
                    alert('Por favor ingresa el nombre de la tienda');
                    return;
                }
                customStores.add(storeName);
                updateStoreFilters();
            }
            
            const taskData = {
                store: storeName,
                observation: document.getElementById('taskObservation').value,
                responsible: document.getElementById('taskResponsible').value,
                date: document.getElementById('taskDate').value,
                solution: document.getElementById('taskSolution').value,
                completed: false
            };

            if (editingTaskId) {
                const task = tasks.find(t => t.id === editingTaskId);
                Object.assign(task, taskData);
            } else {
                tasks.push({ id: nextId++, ...taskData });
            }

            closeModal();
            renderTasks();
        });

        function updateStoreFilters() {
            const allStores = [...new Set(tasks.map(t => t.store))].sort();
            const filterSelect = document.getElementById('filterStore');
            const taskStoreSelect = document.getElementById('taskStore');
            
            // Actualizar filtro
            const currentFilter = filterSelect.value;
            filterSelect.innerHTML = '<option value="">Todas las tiendas</option>' +
                allStores.map(store => `<option value="${store}">${store}</option>`).join('');
            filterSelect.value = currentFilter;
            
            // Actualizar select de tareas (mantener las originales + nuevas)
            const lastOption = taskStoreSelect.querySelector('option[value="__new__"]');
            taskStoreSelect.innerHTML = `
                <option value="">Selecciona una tienda</option>
                <option value="GRANADA">Granada</option>
                <option value="TDC BONANZA">TDC Bonanza</option>
                <option value="Tienda Autopista">Tienda Autopista</option>
                <option value="Tienda Chipichape">Tienda Chipichape</option>
                <option value="Tienda Altoque Plazas Verdes">Tienda Altoque</option>
                <option value="Tienes Portal MENGA">Portal Menga</option>
                <option value="Tienda MENGA">Tienda Menga</option>
                ${[...customStores].map(store => `<option value="${store}">${store}</option>`).join('')}
                <option value="__new__">➕ Agregar nueva tienda...</option>
            `;
        }

        document.getElementById('searchBox').addEventListener('input', renderTasks);
        document.getElementById('filterStore').addEventListener('change', renderTasks);
        document.getElementById('filterStatus').addEventListener('change', renderTasks);

        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') closeModal();
        });

        updateStoreFilters();
        renderTasks();
