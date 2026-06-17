/**
 * ControladoraInformativo
 * Responsabilidade única: gerenciar a exibição de informativos no feed.
 */
class ControladoraInformativo {

    constructor() {
        this.conta_logada = false;
    }

    /**
     * Carrega e renderiza a lista de informativos no feed.
     */
    carregarInformativos() {
        const container = document.getElementById('container-feed');
        container.innerHTML = "";

        const listaInformativos = [
            Fabrica.criarInformativo(
                "Semana Cultural — programação completa",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "28 de maio • publicado pela administração",
                ""
            ),
            Fabrica.criarInformativo(
                "Feira de Ciências 2026 — Inscrições Abertas",
                "Alunos interessados em participar da feira anual devem submeter seus projetos até o final deste mês na secretaria institucional.",
                "15 de junho • publicado pela coordenação",
                ""
            ),
            Fabrica.criarInformativo(
                "Manutenção na Rede Wi-Fi",
                "Avisamos que a rede sem fio do campus passará por instabilidades nesta sexta-feira devido a uma atualização de protocolos de segurança.",
                "02 de julho • publicado pela TI",
                ""
            )
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
