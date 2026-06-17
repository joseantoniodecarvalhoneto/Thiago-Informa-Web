/**
 * ControladoraProjetos
 * Responsabilidade única: gerenciar o CRUD de projetos.
 * Depende de: Fabrica (para criar projetos).
 */
class ControladoraProjetos {

    constructor() {
        this.conta_logada = false;
    }

    /**
     * Cria um novo projeto usando a Fabrica e salva no localStorage.
     */
    criarProjeto() {
        const nome = document.getElementById('inputNomeProjeto').value;
        const desc = document.getElementById('inputDescProjeto').value;

        if (nome.trim() === "" || desc.trim() === "") {
            alert("Preencha todos os campos do projeto!");
            return;
        }

        const novoProjeto = Fabrica.criarProjeto(nome, desc);

        if (!novoProjeto.validar_dados()) {
            alert("Dados do projeto inválidos!");
            return;
        }

        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
        listaProjetos.push(novoProjeto);
        localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

        document.getElementById('formProjeto').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProjeto'));
        modal.hide();

        this.exibirProjetos();
    }

    /**
     * Renderiza a lista de projetos na tela.
     */
    exibirProjetos() {
        const container = document.getElementById('lista-projetos');
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

        container.innerHTML = "";

        if (listaProjetos.length === 0) {
            container.innerHTML = "<p class='text-center text-muted mt-4'>Nenhum projeto cadastrado.</p>";
            return;
        }

        listaProjetos.forEach(proj => {
            container.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card card-feed p-2 d-flex flex-row align-items-center gap-3 position-relative pe-5">
                        
                        <!-- Botões de Ação Posicionados à Direita -->
                        <div class="position-absolute top-0 end-0 h-100 d-flex flex-column justify-content-center pe-2 gap-2">
                            <button class="btn btn-sm btn-outline-warning rounded-circle" onclick="app.abrirModalEditar(${proj.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="app.excluirProjeto(${proj.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                        </div>

                        <div class="bg-light border rounded p-3 text-center" style="width: 80px; height: 70px;">
                            <i class="fa-regular fa-folder-open text-muted fs-4"></i>
                        </div>
                        <div class="flex-grow-1 text-truncate">
                            <span class="fw-bold small d-block text-truncate">${proj.nome_projeto}</span>
                            <p class="text-muted mb-0 text-truncate-2" style="font-size: 0.75rem;">${proj.descricao}</p>
                            <small class="text-primary" style="font-size: 0.65rem;">Criado em: ${proj.data_criacao}</small>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    /**
     * Abre o modal de edição preenchido com os dados do projeto.
     * @param {number} id
     */
    abrirModalEditar(id) {
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
        const projeto = listaProjetos.find(p => p.id === id);

        if (projeto) {
            document.getElementById('editIdProjeto').value = projeto.id;
            document.getElementById('editNomeProjeto').value = projeto.nome_projeto;
            document.getElementById('editDescProjeto').value = projeto.descricao;

            const modalEdicao = new bootstrap.Modal(document.getElementById('modalEditarProjeto'));
            modalEdicao.show();
        }
    }

    /**
     * Edita um projeto existente (salva alterações).
     * @param {number} index - o ID do projeto
     * @param {Projeto} projetoAtualizado - dados atualizados (opcional, usa inputs do modal)
     */
    editarProjeto(index, projetoAtualizado) {
        const id = index || parseInt(document.getElementById('editIdProjeto').value);
        const novoNome = projetoAtualizado ? projetoAtualizado.nome_projeto : document.getElementById('editNomeProjeto').value;
        const novaDesc = projetoAtualizado ? projetoAtualizado.descricao : document.getElementById('editDescProjeto').value;

        if (novoNome.trim() === "" || novaDesc.trim() === "") {
            alert("Os campos não podem ficar vazios.");
            return;
        }

        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
        const idx = listaProjetos.findIndex(p => p.id === id);

        if (idx !== -1) {
            listaProjetos[idx].nome_projeto = novoNome;
            listaProjetos[idx].descricao = novaDesc;

            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

            const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('modalEditarProjeto'));
            if (modalInstancia) modalInstancia.hide();

            this.exibirProjetos();
        }
    }

    /**
     * Exclui um projeto pelo ID.
     * @param {number} id
     */
    excluirProjeto(id) {
        if (confirm("Tem certeza que deseja excluir este projeto permanentemente?")) {
            let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
            listaProjetos = listaProjetos.filter(p => p.id !== id);
            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

            this.exibirProjetos();
        }
    }

    /**
     * Obtém o valor de um campo de entrada.
     * @param {string} inputId
     * @returns {string}
     */
    obterInput(inputId) {
        const elemento = document.getElementById(inputId);
        return elemento ? elemento.value : "";
    }
}
