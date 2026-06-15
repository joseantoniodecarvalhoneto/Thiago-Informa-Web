const controladora = {
    usuarioLogadoEmail: null, 

    dataAtualCalendario: new Date(), 
    mesesNomes: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],

    
    executarLogin: function (event) {
        event.preventDefault();
        const emailInput = document.getElementById('email').value;
        const senhaInput = document.getElementById('senha').value;

        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];

        const usuarioValido = listaUsuarios.find(u => u.email === emailInput && u.senha === senhaInput);

        if (usuarioValido) {
            this.conta_logada = true;
            this.usuarioLogadoEmail = usuarioValido.email; 
            document.getElementById('tela-login').classList.add('d-none');
            document.getElementById('tela-home').classList.remove('d-none');

            this.exibirProjetos();
            this.carregarInformativos();
        } else {
            alert("E-mail ou senha incorretos! Cadastre-se primeiro.");
        }
    },

    criarUsuario: function () {
        const nome = document.getElementById('cadNomeUsuario').value;
        const email = document.getElementById('cadEmailUsuario').value;
        const senha = document.getElementById('cadSenhaUsuario').value;

        if (!nome || !email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];

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


    excluirConta: function () {
        if (confirm("Tem certeza que deseja excluir sua conta DEFINITIVAMENTE? Você perderá o acesso.")) {
            let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
            listaUsuarios = listaUsuarios.filter(u => u.email !== this.usuarioLogadoEmail);

            localStorage.setItem('usuarios_thiago_informa', JSON.stringify(listaUsuarios));
            alert("Conta excluída.");

            this.logout();
        }
    },


    toggleMenuOpcoes: function () {
        const menu = document.getElementById('menu-opcoes');
        menu.classList.toggle('d-none');
    },


    logout: function () {
        this.conta_logada = false;
        document.getElementById('menu-opcoes').classList.add('d-none');
        document.getElementById('tela-home').classList.add('d-none');
        document.getElementById('tela-login').classList.remove('d-none');

        document.getElementById('formLogin').reset();
    },


    carregarInformativos: function() {
        const container = document.getElementById('container-feed');
        container.innerHTML = "";

        // Exemplos de informativos
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

        if (abaNome === 'agenda') {
            this.renderizarCalendario(); 
            this.carregarFeriados();     
        }
    },

    criarProjeto: function () {
        const nome = document.getElementById('inputNomeProjeto').value;
        const desc = document.getElementById('inputDescProjeto').value;

        if (nome.trim() === "" || desc.trim() === "") {
            alert("Preencha todos os campos do projeto!");
            return;
        }

        const novoProjeto = new Projeto(nome, desc);

        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

        listaProjetos.push(novoProjeto);
        localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

        document.getElementById('formProjeto').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProjeto'));
        modal.hide();

        this.exibirProjetos();
    },


    exibirProjetos: function () {
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

    abrirModalEditar: function (id) {
        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];
        const projeto = listaProjetos.find(p => p.id === id);

        if (projeto) {
            document.getElementById('editIdProjeto').value = projeto.id;
            document.getElementById('editNomeProjeto').value = projeto.nome_projeto;
            document.getElementById('editDescProjeto').value = projeto.descricao;

            const modalEdicao = new bootstrap.Modal(document.getElementById('modalEditarProjeto'));
            modalEdicao.show();
        }
    },

    salvarEdicaoProjeto: function () {
        const id = parseInt(document.getElementById('editIdProjeto').value);
        const novoNome = document.getElementById('editNomeProjeto').value;
        const novaDesc = document.getElementById('editDescProjeto').value;

        if (novoNome.trim() === "" || novaDesc.trim() === "") {
            alert("Os campos não podem ficar vazios.");
            return;
        }

        let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

        const index = listaProjetos.findIndex(p => p.id === id);

        if (index !== -1) {
            listaProjetos[index].nome_projeto = novoNome;
            listaProjetos[index].descricao = novaDesc;

            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

            const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('modalEditarProjeto'));
            modalInstancia.hide();

            this.exibirProjetos();
        }
    },

    excluirProjeto: function (id) {
        if (confirm("Tem certeza que deseja excluir este projeto permanentemente?")) {
            let listaProjetos = JSON.parse(localStorage.getItem('projetos_thiago_informa')) || [];

            listaProjetos = listaProjetos.filter(p => p.id !== id);

            localStorage.setItem('projetos_thiago_informa', JSON.stringify(listaProjetos));

            this.exibirProjetos();
        }
    },

    selecionarDia: function (elementoClicado) {
        const todosOsDias = document.querySelectorAll('.dia-data');
        todosOsDias.forEach(dia => dia.classList.remove('ativo'));

        elementoClicado.classList.add('ativo');
    },

    renderizarCalendario: function() {
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
            htmlDias += `<div class="dia-data ${classeAtivo}" onclick="controladora.selecionarDia(this)">${i}</div>`;
        }

        const diasUsados = primeiroDiaDoMes + ultimoDiaDoMes;
        const diasFaltantes = 42 - diasUsados;
        for(let i = 1; i <= diasFaltantes; i++) {
            htmlDias += `<div class="dia-data text-muted opacity-25">${i}</div>`;
        }

        grid.innerHTML = htmlDias;
    },

    mudarMes: function(direcao) {
        this.dataAtualCalendario.setMonth(this.dataAtualCalendario.getMonth() + direcao);
        this.renderizarCalendario();
    },

    mudarAno: function(direcao) {
        this.dataAtualCalendario.setFullYear(this.dataAtualCalendario.getFullYear() + direcao);
        this.renderizarCalendario();
    },


    carregarFeriados: async function () {
        const container = document.getElementById('lista-feriados');
        const loader = document.getElementById('loader-api');

        try {
            const resposta = await fetch('https://brasilapi.com.br/api/feriados/v1/2026');
            const feriados = await resposta.json();

            if (loader) loader.remove();

            container.innerHTML = "";

            //exemplifica com os 4 primeiros feriados
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
    },


};


class Projeto {
    constructor(nome, descricao) {
        this.id = Date.now();
        this.nome_projeto = nome;
        this.descricao = descricao;
        this.data_criacao = new Date().toLocaleDateString('pt-BR');
    }
}

class Usuario {
    constructor(nome, email, senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil = "Administrador";
    }
}