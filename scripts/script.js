/**
 * Ponto de entrada da aplicação.
 * Inicializa a Fachada (Interface) e expõe como variável global.
 * 
 * Estrutura SOLID:
 *   Models:      Usuario, Projeto, Informativo
 *   Factory:     Fabrica
 *   Controllers: ControladoraAutenticacao, ControladoraInformativo, ControladoraProjetos
 *   Facade:      Interface
 */

// Instância global da fachada — usada pelo HTML via onclick="app.metodo()"
const app = new Interface();