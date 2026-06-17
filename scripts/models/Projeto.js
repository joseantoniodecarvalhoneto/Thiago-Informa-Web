/**
 * Classe Projeto
 * Responsabilidade única: representar os dados de um projeto.
 */
class Projeto {
    constructor(nome, descricao) {
        this.id = Date.now();
        this.nome_projeto = nome;
        this.descricao = descricao;
        this.data = new Date();
        this.imagem = "";
        this.atualizacoes = [];
        this.data_criacao = new Date().toLocaleDateString('pt-BR');
        this.turmas = [];
    }

    /**
     * Valida se os dados obrigatórios do projeto estão preenchidos.
     * @returns {boolean}
     */
    validar_dados() {
        return this.nome_projeto.trim() !== "" && this.descricao.trim() !== "";
    }
}
