document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('projects');
    const addProjectForm = document.getElementById('add-project-form');

    // Função para carregar os projetos
    const loadProjects = async () => {
        try {
            const response = await fetch('/api/projetos');
            const projetos = await response.json();

            projectList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            projetos.forEach(projeto => {
                const li = document.createElement('li');
                li.textContent = `${projeto.title} - ${projeto.description}`;
                
                // Botões para editar e deletar
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.onclick = () => editProject(projeto);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Deletar';
                deleteButton.onclick = () => deleteProject(projeto.id);

                li.appendChild(editButton);
                li.appendChild(deleteButton);

                projectList.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
        }
    };


    addProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        try {
            const response = await fetch('/api/projetos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                // Limpa o formulário
                addProjectForm.reset();

                // Recarrega a lista de projetos
                loadProjects();
            } else {
                console.error('Erro ao adicionar projeto:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao adicionar projeto:', error);
        }
    });

    const deleteProject = async (id) => {
        try {
            const response = await fetch(`/api/projetos/${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                loadProjects();
            } else {
                console.error('Erro ao deletar projeto:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao deletar projeto:', error);
        }
    };
    
    const editProject = (projeto) => {
        const titleField = document.getElementById('title');
        const descriptionField = document.getElementById('description');
        const addButton = document.querySelector('#add-project-form button');
    
        // Preenche o formulário com os dados do projeto
        titleField.value = projeto.title;
        descriptionField.value = projeto.description;
    
        // Muda o texto do botão para "Atualizar"
        addButton.textContent = 'Atualizar';
    
        // Adiciona evento para atualizar o projeto ao invés de criar um novo
        addProjectForm.onsubmit = async (e) => {
            e.preventDefault();
    
            try {
                const response = await fetch(`/api/projetos/${projeto.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: titleField.value,
                        description: descriptionField.value,
                    }),
                });
    
                if (response.ok) {
                    // Limpa o formulário e reseta o botão
                    addProjectForm.reset();
                    addButton.textContent = 'Adicionar';
                    addProjectForm.onsubmit = null;
    
                    loadProjects();
                } else {
                    console.error('Erro ao atualizar projeto:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao atualizar projeto:', error);
            }
        };
    };

    loadProjects(); // Carrega os projetos ao carregar a página
});
