/**
 * ControladoraAutenticacao (Singleton)
 * Responsabilidade única: gerenciar autenticação, cadastro e perfil de usuários.
 * Depende de: Fabrica (para criar usuários).
 */
class ControladoraAutenticacao {

    constructor() {
        if (ControladoraAutenticacao.instancia) {
            return ControladoraAutenticacao.instancia;
        }

        this.conta_logada = false;
        this.usuarioLogadoEmail = null;

        ControladoraAutenticacao.instancia = this;
    }

    /**
     * Verifica as credenciais e executa o login.
     * @param {Event} event
     * @returns {boolean} true se o login foi bem-sucedido
     */
    verificaLogin(event) {
        event.preventDefault();

        const emailInput = document.getElementById('email').value;
        const senhaInput = document.getElementById('senha').value;

        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
        const usuarioValido = listaUsuarios.find(u => u.email === emailInput && u.senha === senhaInput);

        if (usuarioValido) {
            this.conta_logada = true;
            this.usuarioLogadoEmail = usuarioValido.email;
            return true;
        } else {
            alert("E-mail ou senha incorretos! Cadastre-se primeiro.");
            return false;
        }
    }

    /**
     * Verifica se o usuário logado é administrador.
     * @returns {boolean}
     */
    verificarAdm() {
        if (!this.conta_logada || !this.usuarioLogadoEmail) return false;

        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
        const user = listaUsuarios.find(u => u.email === this.usuarioLogadoEmail);

        return user && user.perfil === "Administrador";
    }

    /**
     * Cria um novo usuário usando a Fabrica.
     */
    criarUsuario() {
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

        const novoUser = Fabrica.criarUsuario(nome, email, senha);
        listaUsuarios.push(novoUser);
        localStorage.setItem('usuarios_thiago_informa', JSON.stringify(listaUsuarios));

        alert("Conta criada com sucesso! Faça o login.");

        document.getElementById('formNovoUsuario').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalCadastrarUsuario')).hide();
    }

    /**
     * Abre o modal de edição de perfil preenchido com os dados do usuário logado.
     */
    abrirModalEditarUsuario() {
        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
        const user = listaUsuarios.find(u => u.email === this.usuarioLogadoEmail);

        if (user) {
            document.getElementById('editNomeUsuario').value = user.nome;
            document.getElementById('editSenhaUsuario').value = user.senha;

            document.getElementById('menu-opcoes').classList.add('d-none');
            new bootstrap.Modal(document.getElementById('modalEditarUsuario')).show();
        }
    }

    /**
     * Salva as alterações do perfil do usuário logado.
     */
    salvarEdicaoUsuario() {
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
    }

    /**
     * Exclui a conta do usuário logado.
     * @param {Function} onLogout - callback executado após a exclusão
     */
    excluirConta(onLogout) {
        if (confirm("Tem certeza que deseja excluir sua conta DEFINITIVAMENTE? Você perderá o acesso.")) {
            let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_thiago_informa')) || [];
            listaUsuarios = listaUsuarios.filter(u => u.email !== this.usuarioLogadoEmail);

            localStorage.setItem('usuarios_thiago_informa', JSON.stringify(listaUsuarios));
            alert("Conta excluída.");

            if (onLogout) onLogout();
        }
    }

    /**
     * Realiza o logout do usuário.
     */
    logout() {
        this.conta_logada = false;
        this.usuarioLogadoEmail = null;
    }
}

// Propriedade estática para o Singleton
ControladoraAutenticacao.instancia = null;
