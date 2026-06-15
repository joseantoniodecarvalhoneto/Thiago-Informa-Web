/**
 * Objeto Controlador do Sistema
 * Mapeia as ações da interface e gerencia os estados de exibição.
 */
const controladora = {
    usuarioLogadoEmail: null, // Nova propriedade para saber quem está logado

    // Variáveis de estado do calendário
    dataAtualCalendario: new Date(), // Guarda o mês/ano que o usuário está olhando
    mesesNomes: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],

    /**
     * READ: Valida o Login usando o localStorage
     */
    executarLogin: function (event) {
        event.preventDefault();
        const emailInput = document.getElementById('email').value;
        const senhaInput = document.getElementById('senha').value;

        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];

        // Verifica se existe um usuário com esse email e senha
        const usuarioValido = listaUsuarios.find(u => u.email === emailInput && u.senha === senhaInput);

        if (usuarioValido) {
            this.conta_logada = true;
            this.usuarioLogadoEmail = usuarioValido.email; // Guarda a sessão

            document.getElementById('tela-login').classList.add('d-none');
            document.getElementById('tela-home').classList.remove('d-none');

            // Carrega os dados da tela
            this.exibirProjetos();
            this.carregarInformativos();
        } else {
            alert("E-mail ou senha incorretos! Cadastre-se primeiro.");
        }
    },

    /**
     * CREATE: Cadastra novo usuário
     */
    criarUsuario: function () {
        const nome = document.getElementById('cadNomeUsuario').value;
        const email = document.getElementById('cadEmailUsuario').value;
        const senha = document.getElementById('cadSenhaUsuario').value;

        if (!nome || !email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];

        // Verifica se e-mail já existe
        if (listaUsuarios.some(u => u.email === email)) {
            alert("Este e-mail já está cadastrado!");
            return;
        }

        const novoUser = new Usuario(nome, email, senha);
        listaUsuarios.push(novoUser);
        localStorage.setItem('usuarios_thiago_informa', JSON.stringify(listaUsuarios));

        alert("Conta criada com sucesso! Faça o login.");

        document.getElementById('formNovoUsuario').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalCadastrarUsuario')).hide();
    },

    /**
     * UPDATE: Abre modal e salva edição do Usuário logado
     */
    abrirModalEditarUsuario: function () {
        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
        const user = listaUsuarios.find(u => u.email === this.usuarioLogadoEmail);

        if (user) {
            document.getElementById('editNomeUsuario').value = user.nome;
            document.getElementById('editSenhaUsuario').value = user.senha;

            document.getElementById('menu-opcoes').classList.add('d-none'); // Fecha o menu
            new bootstrap.Modal(document.getElementById('modalEditarUsuario')).show();
        }
    },

    salvarEdicaoUsuario: function () {
        const novoNome = document.getElementById('editNomeUsuario').value;
        const novaSenha = document.getElementById('editSenhaUsuario').value;

        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
        const index = listaUsuarios.findIndex(u => u.email === this.usuarioLogadoEmail);

        if (index !== -1) {
            listaUsuarios[index].nome = novoNome;
            listaUsuarios[index].senha = novaSenha;
            localStorage.setItem('usuarios_thiago_informa', JSON.stringify(listaUsuarios));

            bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario')).hide();
            alert("Perfil atualizado com sucesso!");
        }
    },

    /**
     * DELETE: Exclui a própria conta do usuário
     */
    excluirConta: function () {
        if (confirm("Tem certeza que deseja excluir sua conta DEFINITIVAMENTE? Você perderá o acesso.")) {
            let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
            listaUsuarios = listaUsuarios.filter(u => u.email !== this.usuarioLogadoEmail);

            localStorage.setItem('usuarios_thiago_informa', JSON.stringify(listaUsuarios));
            alert("Conta excluída.");

            // Força o logout
            this.logout();
        }
    },

    /**
     * Alterna a visibilidade do menu suspenso de configurações.
     */
    toggleMenuOpcoes: function () {
        const menu = document.getElementById('menu-opcoes');
        menu.classList.toggle('d-none');
    },

    /**
     * Finaliza a sessão atual e retorna à raiz de autenticação.
     */
    logout: function () {
        this.conta_logada = false;
        document.getElementById('menu-opcoes').classList.add('d-none');
        document.getElementById('tela-home').classList.add('d-none');
        document.getElementById('tela-login').classList.remove('d-none');

        // Limpeza dos campos para o próximo ciclo de acesso
        document.getElementById('formLogin').reset();
    },

    /**
     * READ: Simula a leitura de informativos e desenha no Feed
     */
    carregarInformativos: function() {
        const container = document.getElementById('container-feed');
        container.innerHTML = ""; // Esvazia o contêiner para evitar duplicações

        // Matriz simulando dados da entidade 'Informativo' do seu diagrama
        const listaInformativos = [
            {
                titulo: "Semana Cultural — programação completa",
                data: "28 de maio • publicado pela administração",
                descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
                titulo: "Feira de Ciências 2026 — Inscrições Abertas",
                data: "15 de junho • publicado pela coordenação",
                descricao: "Alunos interessados em participar da feira anual devem submeter seus projetos até o final deste mês na secretaria institucional."
            },
            {
                titulo: "Manutenção na Rede Wi-Fi",
                data: "02 de julho • publicado pela TI",
                descricao: "Avisamos que a rede sem fio do campus passará por instabilidades nesta sexta-feira devido a uma atualização de protocolos de segurança."
            }
        ];

        // Injeta cada informativo no HTML, forçando o transbordo no eixo Y
        listaInformativos.forEach(info => {
            container.innerHTML += `
                <div class="col-12">
                    <div class="card card-feed p-3 shadow-sm mb-2">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <i class="fa-solid fa-envelope text-dark"></i>
                            <span class="fw-bold small">${info.titulo}</span>
                        </div>
                        <small class="text-muted d-block mb-3">${info.data}</small>
                        
                        <div class="image-placeholder mx-auto mb-3">
                            <i class="fa-regular fa-image fs-1 mb-2"></i>
                            <span class="fw-bold text-uppercase d-block small text-secondary">No Image Available</span>
                        </div>

                        <p class="text-muted small mb-0">${info.descricao}</p>
                    </div>
                </div>
            `;
        });
    },

    navegarAba: function (abaNome) {
       
        document.getElementById('aba-inicio').classList.add('d-none');
        document.getElementById('aba-projetos').classList.add('d-none');
        document.getElementById('aba-agenda').classList.add('d-none');

        document.getElementById('aba-' + abaNome).classList.remove('d-none');

        document.getElementById('nav-inicio').classList.remove('active');
        document.getElementById('nav-projetos').classList.remove('active');
        document.getElementById('nav-agenda').classList.remove('active');

        document.getElementById('nav-' + abaNome).classList.add('active');
        document.getElementById('menu-opcoes').classList.add('d-none');

        // Chama as funções dinâmicas apenas quando a Agenda for aberta
        if (abaNome === 'agenda') {
            this.renderizarCalendario(); // Cria o calendário matemático
            this.carregarFeriados();     // Chama a API da BrasilAPI
        }
    },

    // Adicione isto DENTRO do objeto controladora, após a vírgula do método navegarAba:

    /**
     * CREATE: Cria um novo projeto e salva no localStorage
     */
    criarProjeto: function () {
        const nome = document.getElementById('inputNomeProjeto').value;
        const desc = document.getElementById('inputDescProjeto').value;

        if (nome.trim() === "" || desc.trim() === "") {
            alert("Preencha todos os campos do projeto!");
            return;
        }

        // Instancia o objeto baseado na Classe
        const novoProjeto = new Projeto(nome, desc);

        // Busca os projetos antigos no localStorage (ou cria array vazio se não existir)
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

        // Adiciona o novo e salva novamente
        listaProjetos.push(novoProjeto);
        localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

        // Limpa o formulário e fecha o Modal do Bootstrap
        document.getElementById('formProjeto').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProjeto'));
        modal.hide();

        // Atualiza a tela
        this.exibirProjetos();
    },

    /**
     * READ: Lê do localStorage e desenha na tela
     */
    exibirProjetos: function () {
        const container = document.getElementById('lista-projetos');
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

        // Limpa a tela antes de desenhar
        container.innerHTML = "";

        if (listaProjetos.length === 0) {
            container.innerHTML = "<p class='text-center text-muted mt-4'>Nenhum projeto cadastrado.</p>";
            return;
        }

        // Percorre a lista desenhando os cards HTML
        listaProjetos.forEach(proj => {
            container.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card card-feed p-2 d-flex flex-row align-items-center gap-3 position-relative pe-5">
                        
                        <!-- Botões de Ação Posicionados à Direita -->
                        <div class="position-absolute top-0 end-0 h-100 d-flex flex-column justify-content-center pe-2 gap-2">
                            <button class="btn btn-sm btn-outline-warning rounded-circle" onclick="controladora.abrirModalEditar(${proj.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="controladora.excluirProjeto(${proj.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
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
    },

    /**
     * UPDATE (Passo 1): Abre o modal e preenche os campos com os dados atuais
     */
    abrirModalEditar: function (id) {
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
        // Busca o projeto pelo ID
        const projeto = listaProjetos.find(p => p.id === id);

        if (projeto) {
            // Preenche os campos do modal de edição
            document.getElementById('editIdProjeto').value = projeto.id;
            document.getElementById('editNomeProjeto').value = projeto.nome_projeto;
            document.getElementById('editDescProjeto').value = projeto.descricao;

            // Abre o modal via JavaScript usando o Bootstrap
            const modalEdicao = new bootstrap.Modal(document.getElementById('modalEditarProjeto'));
            modalEdicao.show();
        }
    },

    /**
     * UPDATE (Passo 2): Salva as alterações de volta no localStorage
     */
    salvarEdicaoProjeto: function () {
        const id = parseInt(document.getElementById('editIdProjeto').value);
        const novoNome = document.getElementById('editNomeProjeto').value;
        const novaDesc = document.getElementById('editDescProjeto').value;

        if (novoNome.trim() === "" || novaDesc.trim() === "") {
            alert("Os campos não podem ficar vazios.");
            return;
        }

        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

        // Encontra o índice do projeto que estamos editando
        const index = listaProjetos.findIndex(p => p.id === id);

        if (index !== -1) {
            // Atualiza os dados
            listaProjetos[index].nome_projeto = novoNome;
            listaProjetos[index].descricao = novaDesc;

            // Salva no localStorage
            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

            // Esconde o modal
            const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('modalEditarProjeto'));
            modalInstancia.hide();

            // Atualiza a tela
            this.exibirProjetos();
        }
    },

    /**
     * DELETE: Remove um projeto permanentemente
     */
    excluirProjeto: function (id) {
        // Confirmação para evitar exclusão acidental (boa prática)
        if (confirm("Tem certeza que deseja excluir este projeto permanentemente?")) {
            let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

            // Filtra a lista, mantendo apenas os projetos que NÃO TÊM o ID selecionado
            listaProjetos = listaProjetos.filter(p => p.id !== id);

            // Salva a nova lista no localStorage
            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

            // Atualiza a tela
            this.exibirProjetos();
        }
    },

    /**
     * Move o destaque visual (círculo vermelho) no calendário
     */
    selecionarDia: function (elementoClicado) {
        // Remove a classe 'ativo' de todos os dias
        const todosOsDias = document.querySelectorAll('.dia-data');
        todosOsDias.forEach(dia => dia.classList.remove('ativo'));

        // Adiciona a classe 'ativo' apenas no dia clicado
        elementoClicado.classList.add('ativo');
    }, // <-- OLHA A CHAVE COM VÍRGULA AQUI! Isso fecha a função.

    /**
     * Motor Dinâmico do Calendário
     * Calcula os dias do mês e desenha o grid HTML
     */
    renderizarCalendario: function() {
        const grid = document.getElementById('grid-dias');
        const displayMes = document.getElementById('display-mes');
        const displayAno = document.getElementById('display-ano');

        // Pega o mês e o ano que estamos visualizando na memória
        const ano = this.dataAtualCalendario.getFullYear();
        const mes = this.dataAtualCalendario.getMonth();

        // Atualiza os textos do cabeçalho
        displayMes.innerHTML = `${this.mesesNomes[mes]} <i class="fa-solid fa-caret-down ms-1" style="font-size: 0.7rem;"></i>`;
        displayAno.innerHTML = `${ano} <i class="fa-solid fa-caret-down ms-1" style="font-size: 0.7rem;"></i>`;

        // Inicia o HTML com os cabeçalhos da semana
        let htmlDias = `
            <div class="dia-semana">D</div><div class="dia-semana">S</div><div class="dia-semana">T</div>
            <div class="dia-semana">Q</div><div class="dia-semana">Q</div><div class="dia-semana">S</div>
            <div class="dia-semana">S</div>
        `;

        // Cálculos matemáticos usando o Objeto Date nativo
        const primeiroDiaDoMes = new Date(ano, mes, 1).getDay(); // Qual dia da semana começa (0 a 6)
        const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate(); // Total de dias no mês atual (ex: 28, 30, 31)
        const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate(); // Total de dias do mês passado

        // 1. Preenche os dias transparentes do final do mês anterior (para alinhar o grid)
        for (let i = primeiroDiaDoMes - 1; i >= 0; i--) {
            htmlDias += `<div class="dia-data text-muted opacity-25">${ultimoDiaMesAnterior - i}</div>`;
        }

        // 2. Preenche os dias reais do mês atual
        const hoje = new Date();
        for (let i = 1; i <= ultimoDiaDoMes; i++) {
            let classeAtivo = '';
            // Se o dia no laço for exatamente o dia de "hoje" na vida real, pinta a bolinha de vermelho
            if (i === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                classeAtivo = 'ativo';
            }
            htmlDias += `<div class="dia-data ${classeAtivo}" onclick="controladora.selecionarDia(this)">${i}</div>`;
        }

        // 3. Preenche os dias transparentes do próximo mês (para completar 42 blocos do calendário)
        const diasUsados = primeiroDiaDoMes + ultimoDiaDoMes;
        const diasFaltantes = 42 - diasUsados;
        for(let i = 1; i <= diasFaltantes; i++) {
            htmlDias += `<div class="dia-data text-muted opacity-25">${i}</div>`;
        }

        // Injeta tudo na tela de uma vez só
        grid.innerHTML = htmlDias;
    },

    mudarMes: function(direcao) {
        // soma ou subtrai meses (-1 ou +1) e recarrega a tela
        this.dataAtualCalendario.setMonth(this.dataAtualCalendario.getMonth() + direcao);
        this.renderizarCalendario();
    },

    mudarAno: function(direcao) {
        // soma ou subtrai anos (-1 ou +1) e recarrega a tela
        this.dataAtualCalendario.setFullYear(this.dataAtualCalendario.getFullYear() + direcao);
        this.renderizarCalendario();
    },

    /**
     * API EXTERNA: Busca os feriados nacionais usando fetch
     */
    carregarFeriados: async function () {
        const container = document.getElementById('lista-feriados');
        const loader = document.getElementById('loader-api');

        try {
            // Requisição para a BrasilAPI buscando feriados do ano atual
            const resposta = await fetch('https://brasilapi.com.br/api/feriados/v1/2026');
            const feriados = await resposta.json();

            // Remove o loader de carregamento
            if (loader) loader.remove();

            // Limpa o contêiner por segurança
            container.innerHTML = "";

            // Pega apenas os 4 primeiros feriados (ou próximos) para exemplificar
            const primeirosFeriados = feriados.slice(0, 4);

            primeirosFeriados.forEach(feriado => {
                // Converte a data (ex: "2026-01-01") para o formato brasileiro
                const dataPartes = feriado.date.split('-');
                const dataFormatada = `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]}`;

                // Injeta o HTML com os dados vindos da API
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
    },


};

/**
 * Classe Projeto baseada no Diagrama de Classes
 */
class Projeto {
    constructor(nome, descricao) {
        this.id = Date.now(); // Identificador único gerado na hora
        this.nome_projeto = nome;
        this.descricao = descricao;
        this.data_criacao = new Date().toLocaleDateString('pt-BR');
    }
}

/**
 * Classe Usuario baseada no Diagrama de Classes
 */
class Usuario {
    constructor(nome, email, senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil = "Administrador"; // Perfil padrão conforme diagrama
    }
}