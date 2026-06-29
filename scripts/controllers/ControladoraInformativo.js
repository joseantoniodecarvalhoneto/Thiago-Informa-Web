/**
 * ControladoraInformativo
 * Responsabilidade única: gerenciar a exibição de informativos no feed.
 */
class ControladoraInformativo {

    constructor() {
        this.conta_logada = false;

        // Estado do Carrossel de Fixados
        this.carrosselIntervalo = null;
        this.tempoRolagem = 3500;
        this.isScrolling = false;
        this.deveGirarCarrossel = false;
    }

    /**
     * Carrega e renderiza a lista de informativos
     */
    carregarInformativos() {
        const container = document.getElementById('container-feed');
        let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];

        container.innerHTML = "";

        if (listaInformativos.length === 0) {
            container.innerHTML = "<p class='text-center text-muted mt-4'>Nenhum informativo publicado no momento.</p>";
            return;
        }

        listaInformativos.slice().reverse().forEach(info => {
            const blocoImagem = info.imagem && info.imagem !== ""
                ? `<img src="${info.imagem}" class="img-fluid rounded w-100 shadow-sm bg-light" style="object-fit: cover; height: 100%; min-height: 150px; border: 1px solid #dee2e6;" alt="Capa do post">`
                : `<div class="img-preview-box w-100 shadow-sm" style="height: 100%; min-height: 150px;">
                        <div class="text-center text-muted">
                            <i class="fa-regular fa-image fs-1 mb-2"></i>
                            <span class="fw-bold d-block small">NO IMAGE AVAILABLE</span>
                        </div>
                   </div>`;

            const corAlfinete = info.fixado ? "text-danger" : "text-dark";

            container.innerHTML += `
                <div class="col-12">
                    <div class="card p-3 shadow-sm mb-3 position-relative modal-figma-border">
                        
                        <div class="position-absolute top-0 end-0 p-3 d-flex gap-2 z-1 apenas-admin">
                            <button class="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width: 35px; height: 35px; border: 2px solid #000;" onclick="app.alternarFixado(${info.id})" title="Fixar Post">
                                <i class="fa-solid fa-thumbtack ${corAlfinete}"></i>
                            </button>
                            <button class="btn btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width: 35px; height: 35px; border: 2px solid #000;" onclick="app.abrirModalEditarInfo(${info.id})" title="Editar">
                                <i class="fa-solid fa-pen-to-square text-dark"></i>
                            </button>
                        </div>

                        <div class="d-md-none mb-3 pe-5">
                            <span class="fw-bold fs-6 text-dark d-block">${info.titulo}</span>
                            <small class="text-muted fw-bold d-block mt-1" style="font-size: 0.75rem;">
                                <i class="fa-regular fa-clock me-1"></i> ${info.data}
                            </small>
                        </div>

                        <div class="row g-3">
                            
                            <div class="col-12 col-md-4 col-lg-4">
                                ${blocoImagem}
                            </div>

                            <div class="col-12 col-md-8 col-lg-8 d-flex flex-column justify-content-center">
                                
                                <div class="d-none d-md-block pe-5 mb-2">
                                    <span class="fw-bold fs-6 text-dark d-block">${info.titulo}</span>
                                    <small class="text-muted fw-bold d-block mt-1" style="font-size: 0.75rem;">
                                        <i class="fa-regular fa-clock me-1"></i> ${info.data}
                                    </small>
                                </div>
                                
                                <p class="text-dark small mb-0 mt-2" style="text-align: justify;">${info.descricao}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            `;
        });
    }

    /**
     * Carrega os informativos fixados
     */
    carregarFixados() {
        const container = document.getElementById('container-fixados-scroll');
        const btnPrev = document.getElementById('btn-prev-fixado');
        const btnNext = document.getElementById('btn-next-fixado');

        if (!container) return;

        let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];
        const fixados = listaInformativos.filter(info => info.fixado).reverse();

        container.innerHTML = "";

        if (fixados.length === 0) {
            container.innerHTML = "<p class='text-muted small px-3 mt-2'>Nenhum post fixado no momento.</p>";
            if (btnPrev) btnPrev.className = "btn p-0 border-0 position-absolute start-0 top-50 translate-middle-y z-3 d-none";
            if (btnNext) btnNext.className = "btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y z-3 d-none";
            window.deveGirarCarrossel = false;
            return;
        }

        fixados.forEach(info => {
            container.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card card-fixado p-3 position-relative h-100 modal-figma-border">
                        <i class="fa-solid fa-thumbtack position-absolute top-0 end-0 m-2 text-danger cursor-pointer apenas-admin" style="transform: rotate(45deg); z-index: 2;" onclick="app.alternarFixado(${info.id})" title="Desfixar"></i>
                        
                        <div onclick="app.abrirModalVisualizarInfo(${info.id})" style="cursor: pointer;" class="h-100 d-flex flex-column">
                            <span class="fw-bold small d-block text-truncate pe-4 text-dark">${info.titulo}</span>
                            <p class="text-muted small mb-0 mt-1 text-truncate-2" style="text-align: justify;">${info.descricao}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        if (fixados.length <= 4) {
            if (btnPrev) btnPrev.className = "btn p-0 border-0 position-absolute start-0 top-50 translate-middle-y z-3 d-none";
            if (btnNext) btnNext.className = "btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y z-3 d-none";
            this.deveGirarCarrossel = false; 
            clearInterval(this.carrosselIntervalo); 
        } else {
            if (btnPrev) btnPrev.className = "btn p-0 border-0 position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-block";
            if (btnNext) btnNext.className = "btn p-0 border-0 position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-block";
            this.deveGirarCarrossel = true; 
            this.iniciarCarrossel(); 
        }
    }

    /**
     * Cria um novo informativo (post) convertendo a imagem e salvando no localStorage.
     */
    criarInformativo() {
        const titulo = document.getElementById('inputTituloInfo').value;
        const desc = document.getElementById('inputDescInfo').value;
        const inputImagem = document.getElementById('inputImagemInfo');

        if (titulo.trim() === "" || desc.trim() === "") {
            alert("Preencha o título e a descrição do post!");
            return;
        }

        const finalizarSalvamento = (imagemBase64) => {
            const novoInfo = Fabrica.criarInformativo(titulo, desc, null, imagemBase64);

            if (!novoInfo.validar_dados()) {
                alert("Dados do post inválidos!");
                return;
            }

            let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];
            listaInformativos.push(novoInfo);
            localStorage.setItem('informativos_thiago_informa', JSON.stringify(listaInformativos));

            document.getElementById('formInformativo').reset();
            const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('modalInformativo'));
            if (modalInstancia) modalInstancia.hide();

            this.carregarInformativos();
        };

        if (inputImagem.files && inputImagem.files[0]) {
            const leitor = new FileReader();

            leitor.onload = function (evento) {
                const base64String = evento.target.result; // A imagem convertida em string de texto!
                finalizarSalvamento(base64String);
            };

            leitor.readAsDataURL(inputImagem.files[0]);
        } else {
            finalizarSalvamento("");
        }
    }

    /**
     * Abre o modal de edição preenchido com os dados do post específico.
     * @param {number} id
     */
    abrirModalEditarInfo(id) {
        let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];
        const info = listaInformativos.find(i => i.id === id);

        if (info) {
            document.getElementById('editIdInfo').value = info.id;
            document.getElementById('editTituloInfo').value = info.titulo;
            document.getElementById('editDescInfo').value = info.descricao;
            document.getElementById('editImagemInfoAtual').value = info.imagem;

            const modalEdicao = new bootstrap.Modal(document.getElementById('modalEditarInformativo'));
            modalEdicao.show();
        }
    }

    /**
     * Salva as edições do post, lidando com a possibilidade de uma nova imagem.
     */
    editarInformativo() {
        const id = parseInt(document.getElementById('editIdInfo').value);
        const novoTitulo = document.getElementById('editTituloInfo').value;
        const novaDesc = document.getElementById('editDescInfo').value;
        const imagemAtual = document.getElementById('editImagemInfoAtual').value;
        const inputNovaImagem = document.getElementById('editNovaImagemInfo');

        if (novoTitulo.trim() === "" || novaDesc.trim() === "") {
            alert("O título e a descrição não podem ficar vazios.");
            return;
        }

        const finalizarEdicao = (imagemBase64) => {
            let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];
            const index = listaInformativos.findIndex(i => i.id === id);

            if (index !== -1) {
                listaInformativos[index].titulo = novoTitulo;
                listaInformativos[index].descricao = novaDesc;
                listaInformativos[index].imagem = imagemBase64; // Atualiza ou mantém a imagem

                localStorage.setItem('informativos_thiago_informa', JSON.stringify(listaInformativos));

                document.getElementById('formEditarInformativo').reset();
                const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('modalEditarInformativo'));
                if (modalInstancia) modalInstancia.hide();

                this.carregarInformativos(); 
            }
        };

        if (inputNovaImagem.files && inputNovaImagem.files[0]) {
            const leitor = new FileReader();
            leitor.onload = function (evento) {
                finalizarEdicao(evento.target.result); 
            };
            leitor.readAsDataURL(inputNovaImagem.files[0]);
        } else {
            finalizarEdicao(imagemAtual);
        }
    }

    /**
     * Exclui um post pelo ID.
     * @param {number} id
     */
    excluirInfo(id) {
        if (confirm("Tem certeza que deseja excluir este post permanentemente?")) {
            let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];
            listaInformativos = listaInformativos.filter(i => i.id !== id);
            localStorage.setItem('informativos_thiago_informa', JSON.stringify(listaInformativos));

            this.carregarInformativos(); 
        }
    }

    /**
     * Gera o preview visual de uma imagem selecionada pelo usuário no input file.
     */
    gerarPreviewImagem(inputElement, containerId) {
        const container = document.getElementById(containerId);

        if (inputElement.files && inputElement.files[0]) {
            const leitor = new FileReader();
            leitor.onload = function (e) {
                container.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            leitor.readAsDataURL(inputElement.files[0]);
        }
    }

    /**
     * Remove a imagem do preview e zera os campos ocultos.
     */
    removerPreviewImagem(containerId, hiddenInputId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fa-regular fa-image fs-1 mb-2"></i>
                <span class="fw-bold d-block small">NO IMAGE AVAILABLE</span>
            </div>
        `;

        const inputFisico = containerId === 'previewContainerCriar' ? document.getElementById('inputImagemInfo') : document.getElementById('editNovaImagemInfo');
        if (inputFisico) inputFisico.value = "";

        if (hiddenInputId) {
            document.getElementById(hiddenInputId).value = "";
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

    /**
     * Alterna o estado de fixado de um post e atualiza as telas.
     * @param {number} id 
     */
    alternarFixado(id) {
        let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];
        const index = listaInformativos.findIndex(i => i.id === id);

        if (index !== -1) {
            listaInformativos[index].fixado = !listaInformativos[index].fixado;
            localStorage.setItem('informativos_thiago_informa', JSON.stringify(listaInformativos));

            this.carregarInformativos();
            this.carregarFixados();
        }
    }

    /**
     * Inicia o motor do carrossel.
     */
    iniciarCarrossel() {
        clearInterval(this.carrosselIntervalo);
        this.carrosselIntervalo = setInterval(() => this.scrollCarrossel(1), this.tempoRolagem);
    }

    /**
     * Rola o carrossel para a esquerda ou direita manipulando o DOM.
     * @param {number} direcao (1 para direita, -1 para esquerda)
     */
    scrollCarrossel(direcao) {
        if (!this.deveGirarCarrossel) return;

        const container = document.getElementById('container-fixados-scroll');
        if (!container || this.isScrolling) return;

        this.isScrolling = true;

        clearInterval(this.carrosselIntervalo);
        this.carrosselIntervalo = setInterval(() => this.scrollCarrossel(1), this.tempoRolagem);

        const primeiroCartao = container.firstElementChild;
        const quantidadeScroll = primeiroCartao.offsetWidth + 16;

        if (direcao === 1) {
            container.style.scrollBehavior = 'smooth';
            container.scrollBy({ left: quantidadeScroll });

            setTimeout(() => {
                container.style.scrollBehavior = 'auto';
                container.appendChild(primeiroCartao);
                container.scrollLeft -= quantidadeScroll;
                this.isScrolling = false;
            }, 600);

        } else {
            container.style.scrollBehavior = 'auto';
            const ultimoCartao = container.lastElementChild;

            container.insertBefore(ultimoCartao, primeiroCartao);
            container.scrollLeft += quantidadeScroll;

            requestAnimationFrame(() => {
                container.style.scrollBehavior = 'smooth';
                container.scrollBy({ left: -quantidadeScroll });
                setTimeout(() => { this.isScrolling = false; }, 600);
            });
        }
    }

    /**
     * Abre o modal de visualização preenchido com o post completo.
     * @param {number} id
     */
    abrirModalVisualizarInfo(id) {
        let listaInformativos = JSON.parse(localStorage.getItem('informativos_thiago_informa')) || [];
        const info = listaInformativos.find(i => i.id === id);

        if (info) {
            const container = document.getElementById('conteudoVisualizarInformativo');
            
            const blocoImagem = info.imagem && info.imagem !== ""
                ? `<img src="${info.imagem}" class="img-fluid rounded w-100 shadow-sm bg-light" style="object-fit: cover; height: 100%; min-height: 150px; border: 1px solid #dee2e6;" alt="Capa do post">`
                : `<div class="img-preview-box w-100 shadow-sm" style="height: 100%; min-height: 150px;">
                        <div class="text-center text-muted">
                            <i class="fa-regular fa-image fs-1 mb-2"></i>
                            <span class="fw-bold d-block small">NO IMAGE AVAILABLE</span>
                        </div>
                   </div>`;

            container.innerHTML = `
                <div class="d-md-none mb-3">
                    <span class="fw-bold fs-6 text-dark d-block">${info.titulo}</span>
                    <small class="text-muted fw-bold d-block mt-1" style="font-size: 0.75rem;">
                        <i class="fa-regular fa-clock me-1"></i> ${info.data}
                    </small>
                </div>

                <div class="row g-3">
                    <div class="col-12 col-md-4 col-lg-4">
                        ${blocoImagem}
                    </div>

                    <div class="col-12 col-md-8 col-lg-8 d-flex flex-column justify-content-start">
                        <div class="d-none d-md-block mb-2">
                            <span class="fw-bold fs-6 text-dark d-block">${info.titulo}</span>
                            <small class="text-muted fw-bold d-block mt-1" style="font-size: 0.75rem;">
                                <i class="fa-regular fa-clock me-1"></i> ${info.data}
                            </small>
                        </div>
                        
                        <p class="text-dark small mb-0 mt-2" style="text-align: justify;">${info.descricao}</p>
                    </div>
                </div>
            `;

            const modalVisualizar = new bootstrap.Modal(document.getElementById('modalVisualizarInformativo'));
            modalVisualizar.show();
        }
    }
}
