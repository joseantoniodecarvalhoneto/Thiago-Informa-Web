/**
 * Classe Informativo
 * Responsabilidade única: representar os dados de um informativo/notícia.
 */
class Informativo {
    constructor(titulo, descricao, data, imagem) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.data = data;
        this.imagem = imagem || "";
    }

    /**
     * Valida se os dados obrigatórios do informativo estão preenchidos.
     * @returns {boolean}
     */
    validar_dados() {
        return this.titulo.trim() !== "" && this.descricao.trim() !== "";
    }
}
