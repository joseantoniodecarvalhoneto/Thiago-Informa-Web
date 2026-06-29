/**
 * ControladoraProjetos
 * Responsabilidade única: gerenciar o CRUD de projetos com suporte a imagens.
 */
class ControladoraProjetos {

    constructor() {
        this.conta_logada = false;
    }

    /**
     * Cria um novo projeto convertendo a imagem e salvando no localStorage.
     */
    criarProjeto() {
        const nome = document.getElementById('inputNomeProjeto').value;
        const desc = document.getElementById('inputDescProjeto').value;
        const turma = document.getElementById('inputTurmaProjeto').value;
        const inputImagem = document.getElementById('inputImagemProjeto');

        if (nome.trim() === "" || desc.trim() === "") {
            alert("Preencha o nome e a descrição do projeto!");
            return;
        }

        const finalizarSalvamento = (imagemBase64) => {
            const novoProjeto = Fabrica.criarProjeto(nome, desc, turma, imagemBase64);

            let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
            listaProjetos.push(novoProjeto);
            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

            document.getElementById('formProjeto').reset();
            app.removerPreviewImagem('previewContainerProjetoCriar', null);

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalProjeto'));
            if (modal) modal.hide();

            this.exibirProjetos();
        };

        if (inputImagem.files && inputImagem.files.length > 0) {
            const leitor = new FileReader();
            leitor.onload = function (e) { finalizarSalvamento(e.target.result); };
            leitor.readAsDataURL(inputImagem.files[0]);
        } else {
            finalizarSalvamento("");
        }
    }

    /**
     * modal de edição com dados do projeto
     */
    abrirModalEditar(id) {
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
        const projeto = listaProjetos.find(p => p.id === id);

        if (projeto) {
            document.getElementById('editIdProjeto').value = projeto.id;
            document.getElementById('editNomeProjeto').value = projeto.nome_projeto;
            document.getElementById('editDescProjeto').value = projeto.descricao;
            document.getElementById('editTurmaProjeto').value = projeto.turma;
            document.getElementById('editImagemProjetoAtual').value = projeto.imagem;

            const containerPreview = document.getElementById('previewContainerProjetoEditar');
            if (projeto.imagem && projeto.imagem !== "") {
                containerPreview.innerHTML = `<img src="${projeto.imagem}" style="width:100%; height:100%; object-fit:cover;">`;
            } else {
                containerPreview.innerHTML = `<div class="text-center text-muted"><i class="fa-regular fa-image fs-1"></i></div>`;
            }

            new bootstrap.Modal(document.getElementById('modalEditarProjeto')).show();
        }
    }

    /**
     * Edita um projeto existente 
     */
    editarProjeto() {
        const id = parseInt(document.getElementById('editIdProjeto').value);
        const novoNome = document.getElementById('editNomeProjeto').value;
        const novaDesc = document.getElementById('editDescProjeto').value;
        const novaTurma = document.getElementById('editTurmaProjeto').value;
        const imagemAtual = document.getElementById('editImagemProjetoAtual').value;
        const inputNovaImagem = document.getElementById('editNovaImagemProjeto');

        const finalizarEdicao = (imagemBase64) => {
            let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
            const idx = listaProjetos.findIndex(p => p.id === id);

            if (idx !== -1) {
                listaProjetos[idx].nome_projeto = novoNome;
                listaProjetos[idx].descricao = novaDesc;
                listaProjetos[idx].turma = novaTurma;
                listaProjetos[idx].imagem = imagemBase64;

                localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));
                bootstrap.Modal.getInstance(document.getElementById('modalEditarProjeto')).hide();
                this.exibirProjetos();
            }
        };

        if (inputNovaImagem.files && inputNovaImagem.files[0]) {
            const leitor = new FileReader();
            leitor.onload = function (e) { finalizarEdicao(e.target.result); };
            leitor.readAsDataURL(inputNovaImagem.files[0]);
        } else {
            finalizarEdicao(imagemAtual);
        }
    }

    /**
     * Filtra projetos pela turma selecionada
     */
    filtrarProjetos(turmaSelecionada) {
        const label = document.getElementById('label-filtro-turma');
        if (label) label.innerText = turmaSelecionada;
        this.exibirProjetos(turmaSelecionada);
    }

    /**
     * Renderiza a lista de projetos na tela.
     */
    exibirProjetos(filtroTurma = 'Todos') {
        const container = document.getElementById('lista-projetos');
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

        if (filtroTurma !== 'Todos') {
            listaProjetos = listaProjetos.filter(proj => proj.turma === filtroTurma);
        }

        container.innerHTML = "";
        listaProjetos.slice().reverse().forEach(proj => {
            const miniatura = proj.imagem && proj.imagem !== ""
                ? `<img src="${proj.imagem}" class="img-fluid rounded" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<i class="fa-regular fa-folder-open text-muted fs-4"></i>`;

            container.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card card-feed p-2 d-flex flex-row align-items-center gap-3 position-relative pe-5">
                        <div class="position-absolute top-0 end-0 h-100 d-flex flex-column justify-content-center pe-2 gap-2 apenas-admin">
                            <button class="btn btn-sm btn-outline-warning rounded-circle" onclick="app.abrirModalEditar(${proj.id})"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="app.excluirProjeto(${proj.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <div class="bg-light border rounded d-flex justify-content-center align-items-center" style="width: 80px; height: 70px; overflow: hidden; flex-shrink: 0;">
                            ${miniatura}
                        </div>
                        <div class="flex-grow-1 text-truncate">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="fw-bold small d-block text-truncate">${proj.nome_projeto}</span>
                                <span class="badge bg-danger rounded-pill text-white" style="font-size: 0.6rem;">${proj.turma}</span>
                            </div>
                            <p class="text-muted mb-0 text-truncate-2" style="font-size: 0.75rem;">${proj.descricao}</p>
                            <small class="text-primary" style="font-size: 0.65rem;">Criado em: ${proj.data_criacao}</small>
                        </div>
                    </div>
                </div>`;
        });
    }

    /**
     * Exclui um projeto.
     */
    excluirProjeto(id) {
        if (confirm("Tem certeza que deseja excluir este projeto?")) {
            let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
            listaProjetos = listaProjetos.filter(p => p.id !== id);
            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));
            this.exibirProjetos();
        }
    }
}