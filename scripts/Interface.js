/**
 * Interface (Facade Pattern)
 * Responsabilidade: ser o ponto de acesso único do sistema,
 * delegando operações para as controladoras especializadas.
 * 
 * Também gerencia a navegação entre abas e o calendário/agenda.
 */
class Interface {

    constructor() {
        // Instancia as controladoras
        this.controladoraAuth = new ControladoraAutenticacao();
        this.controladoraInfo = new ControladoraInformativo();
        this.controladoraProjetos = new ControladoraProjetos();

        // Dados do calendário
        this.dataAtualCalendario = new Date();
        this.mesesNomes = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    }

    // ========================
    // MÉTODOS DE EXIBIÇÃO (Facade)
    // ========================

    /**
     * Exibe a tela de projetos.
     */
    exibirProjeto() {
        this.navegarAba('projetos');
    }

    /**
     * Exibe a tela de informativos (início).
     */
    exibirInformativo() {
        this.navegarAba('inicio');
    }

    /**
     * Exibe a tela de edição de projeto (abre modal).
     * @param {number} id
     */
    exibirEdicaoProjeto(id) {
        this.controladoraProjetos.abrirModalEditar(id);
    }

    /**
     * Exibe a tela de agenda.
     */
    exibirAgenda() {
        this.navegarAba('agenda');
    }

    // ========================
    // AUTENTICAÇÃO (delegação)
    // ========================

    /**
     * Executa o login delegando para ControladoraAutenticacao.
     * @param {Event} event
     */
    executarLogin(event) {
        const sucesso = this.controladoraAuth.verificaLogin(event);

        if (sucesso) {
            document.getElementById('tela-login').classList.add('d-none');
            document.getElementById('tela-home').classList.remove('d-none');

            this.controladoraProjetos.exibirProjetos();
            this.controladoraInfo.carregarInformativos();
        }
    }

    mostraSenha() {
        const inputSenha = document.getElementById('senha');
        const iconeSenha = document.getElementById('iconeSenha');

        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
            iconeSenha.classList.replace('bi-eye-slash', 'bi-eye');
        } else {
            inputSenha.type = 'password';
            iconeSenha.classList.replace('bi-eye', 'bi-eye-slash');
        }
    }

    /**
     * Cria um novo usuário delegando para ControladoraAutenticacao.
     */
    criarUsuario() {
        this.controladoraAuth.criarUsuario();
    }

    /**
     * Abre o modal de edição de usuário.
     */
    abrirModalEditarUsuario() {
        this.controladoraAuth.abrirModalEditarUsuario();
    }

    /**
     * Salva edição do perfil do usuário.
     */
    salvarEdicaoUsuario() {
        this.controladoraAuth.salvarEdicaoUsuario();
    }

    /**
     * Exclui a conta do usuário logado.
     */
    excluirConta() {
        this.controladoraAuth.excluirConta(() => this.logout());
    }

    /**
     * Realiza o logout.
     */
    logout() {
        this.controladoraAuth.logout();

        document.getElementById('menu-opcoes').classList.add('d-none');
        document.getElementById('tela-home').classList.add('d-none');
        document.getElementById('tela-login').classList.remove('d-none');

        document.getElementById('formLogin').reset();
    }

    // ========================
    // PROJETOS (delegação)
    // ========================

    /**
     * Cria um novo projeto.
     */
    criarProjeto() {
        this.controladoraProjetos.criarProjeto();
    }

    /**
     * Exibe a lista de projetos.
     */
    exibirProjetos() {
        this.controladoraProjetos.exibirProjetos();
    }

    /**
     * Abre o modal de edição de projeto.
     * @param {number} id
     */
    abrirModalEditar(id) {
        this.controladoraProjetos.abrirModalEditar(id);
    }

    /**
     * Salva edição de projeto.
     */
    salvarEdicaoProjeto() {
        this.controladoraProjetos.editarProjeto();
    }

    /**
     * Exclui um projeto.
     * @param {number} id
     */
    excluirProjeto(id) {
        this.controladoraProjetos.excluirProjeto(id);
    }

    /**
     * Filtra os projetos por turma.
     * @param {string} turma 
     */
    filtrarProjetos(turma) {
        this.controladoraProjetos.filtrarProjetos(turma);
    }

    // ========================
    // INFORMATIVOS (delegação)
    // ========================

    /**
     * Carrega os informativos no feed.
     */
    carregarInformativos() {
        this.controladoraInfo.carregarInformativos();
        this.controladoraInfo.carregarFixados(); // Adicione esta linha
    }

    /**
     * Alterna o estado de fixação do post.
     * @param {number} id 
     */
    alternarFixado(id) {
        this.controladoraInfo.alternarFixado(id);
    }

    /**
     * Cria um novo informativo (post) no feed.
     */
    criarInformativo() {
        this.controladoraInfo.criarInformativo();
    }

    /**
     * Abre o modal de edição de informativo.
     * @param {number} id
     */
    abrirModalEditarInfo(id) {
        this.controladoraInfo.abrirModalEditarInfo(id);
    }

    /**
     * Salva as edições do informativo.
     */
    editarInformativo() {
        this.controladoraInfo.editarInformativo();
    }

    /**
     * Exclui um informativo do feed.
     * @param {number} id
     */
    excluirInfo(id) {
        this.controladoraInfo.excluirInfo(id);
    }

    /**
     * Gera o preview de imagem nos modais.
     */
    gerarPreviewImagem(inputElement, containerId) {
        this.controladoraInfo.gerarPreviewImagem(inputElement, containerId);
    }

    /**
     * Remove a imagem do preview nos modais.
     */
    removerPreviewImagem(containerId, hiddenInputId) {
        this.controladoraInfo.removerPreviewImagem(containerId, hiddenInputId);
    }

    /**
     * Rola o carrossel de fixados manualmente.
     * @param {number} direcao 
     */
    scrollCarrossel(direcao) {
        this.controladoraInfo.scrollCarrossel(direcao);
    }

    /**
     * Abre o modal para visualizar o post completo.
     * @param {number} id
     */
    abrirModalVisualizarInfo(id) {
        this.controladoraInfo.abrirModalVisualizarInfo(id);
    }

    // ========================
    // NAVEGAÇÃO
    // ========================

    /**
     * Navega entre as abas da aplicação.
     * @param {string} abaNome - 'inicio', 'projetos' ou 'agenda'
     */
    navegarAba(abaNome) {
        document.getElementById('aba-inicio').classList.add('d-none');
        document.getElementById('aba-projetos').classList.add('d-none');
        document.getElementById('aba-agenda').classList.add('d-none');

        document.getElementById('aba-' + abaNome).classList.remove('d-none');

        document.getElementById('nav-inicio').classList.remove('active');
        document.getElementById('nav-projetos').classList.remove('active');
        document.getElementById('nav-agenda').classList.remove('active');

        document.getElementById('nav-' + abaNome).classList.add('active');
        document.getElementById('menu-opcoes').classList.add('d-none');

        if (abaNome === 'agenda') {
            this.renderizarCalendario();
            this.carregarFeriados();
        }
    }

    /**
     * Alterna a visibilidade do menu de opções.
     */
    toggleMenuOpcoes() {
        const menu = document.getElementById('menu-opcoes');
        menu.classList.toggle('d-none');
    }

    // ========================
    // AGENDA / CALENDÁRIO
    // ========================

    /**
     * Seleciona um dia no calendário.
     * @param {HTMLElement} elementoClicado
     */
    selecionarDia(elementoClicado) {
        const todosOsDias = document.querySelectorAll('.dia-data');
        todosOsDias.forEach(dia => dia.classList.remove('ativo'));
        elementoClicado.classList.add('ativo');
    }

    /**
     * Renderiza o calendário mensal.
     */
    renderizarCalendario() {
        const grid = document.getElementById('grid-dias');
        const displayMes = document.getElementById('display-mes');
        const displayAno = document.getElementById('display-ano');

        const ano = this.dataAtualCalendario.getFullYear();
        const mes = this.dataAtualCalendario.getMonth();

        displayMes.innerHTML = `${this.mesesNomes[mes]} <i class="fa-solid fa-caret-down ms-1" style="font-size: 0.7rem;"></i>`;
        displayAno.innerHTML = `${ano} <i class="fa-solid fa-caret-down ms-1" style="font-size: 0.7rem;"></i>`;

        let htmlDias = `
            <div class="dia-semana">D</div><div class="dia-semana">S</div><div class="dia-semana">T</div>
            <div class="dia-semana">Q</div><div class="dia-semana">Q</div><div class="dia-semana">S</div>
            <div class="dia-semana">S</div>
        `;

        const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
        const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
        const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();

        for (let i = primeiroDiaDoMes - 1; i >= 0; i--) {
            htmlDias += `<div class="dia-data text-muted opacity-25">${ultimoDiaMesAnterior - i}</div>`;
        }

        const hoje = new Date();
        for (let i = 1; i <= ultimoDiaDoMes; i++) {
            let classeAtivo = '';
            if (i === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                classeAtivo = 'ativo';
            }
            htmlDias += `<div class="dia-data ${classeAtivo}" onclick="app.selecionarDia(this)">${i}</div>`;
        }

        const diasUsados = primeiroDiaDoMes + ultimoDiaDoMes;
        const diasFaltantes = 42 - diasUsados;
        for (let i = 1; i <= diasFaltantes; i++) {
            htmlDias += `<div class="dia-data text-muted opacity-25">${i}</div>`;
        }

        grid.innerHTML = htmlDias;
    }

    /**
     * Avança ou retrocede o mês no calendário.
     * @param {number} direcao - 1 para próximo, -1 para anterior
     */
    mudarMes(direcao) {
        this.dataAtualCalendario.setMonth(this.dataAtualCalendario.getMonth() + direcao);
        this.renderizarCalendario();
    }

    /**
     * Avança ou retrocede o ano no calendário.
     * @param {number} direcao - 1 para próximo, -1 para anterior
     */
    mudarAno(direcao) {
        this.dataAtualCalendario.setFullYear(this.dataAtualCalendario.getFullYear() + direcao);
        this.renderizarCalendario();
    }

    /**
     * Carrega os feriados nacionais da API Brasil.
     */
    async carregarFeriados() {
        const container = document.getElementById('lista-feriados');
        const loader = document.getElementById('loader-api');

        try {
            const resposta = await fetch('https://brasilapi.com.br/api/feriados/v1/2026');
            const feriados = await resposta.json();

            if (loader) loader.remove();

            container.innerHTML = "";

            const primeirosFeriados = feriados.slice(0, 4);

            primeirosFeriados.forEach(feriado => {
                const dataPartes = feriado.date.split('-');
                const dataFormatada = `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]}`;

                container.innerHTML += `
                    <div class="col-12 col-md-6">
                        <div class="card card-feed p-2 d-flex flex-row align-items-center gap-3 border-primary" style="border-width: 2px;">
                            <div class="bg-light border border-primary rounded p-3 text-center text-primary" style="width: 80px; height: 70px;">
                                <span class="fw-bold fs-5">${dataPartes[2]}</span>
                                <span class="d-block" style="font-size: 0.6rem;">${dataPartes[1]}</span>
                            </div>
                            <div class="flex-grow-1">
                                <span class="fw-bold small d-block text-primary">${feriado.name}</span>
                                <p class="text-muted mb-0" style="font-size: 0.75rem;">Feriado Nacional</p>
                                <small class="text-secondary" style="font-size: 0.65rem;">Data: ${dataFormatada}</small>
                            </div>
                        </div>
                    </div>
                `;
            });

        } catch (erro) {
            console.error("Erro ao carregar a API:", erro);
            if (loader) loader.innerHTML = "<p class='text-danger small'>Falha ao carregar feriados. Verifique sua internet.</p>";
        }
    }
}
