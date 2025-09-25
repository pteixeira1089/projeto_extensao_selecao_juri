export class AcoesSelecaoEtapa {

    /**
     * @param {object} handlers - Objeto com funções de callback para os eventos
     * @param {function} handlers.onVoltar - Função a ser chamada caso o usuário deseje voltar
     * @param {function} handlers.onProsseguir - Função a ser chamada quando o usuário deseja prosseguir
     * @param {function} handlers.onSolicitaPlanilhaModelo - Função a ser chamada quando o usuário deseja baixar a planilha modelo
     */
    constructor(handlers) {
        //A view recebe e armazena os handlers, mas não sabe o que eles fazem
        this.handlers = handlers || {};
    }

    
    /**
     * Creates the action buttons for the Seleção de Etapa page
     * @returns {HTMLElement} - The div element that holds the action buttons.
     */
    create() {
        const container = document.createElement('div');
        container.classList.add(
            'body-paragraph',
            'mt-5',
            'mb-4',
            'mx-auto',
            'd-flex',
            'flex-column',
            'justify-content-center',
            'align-items-center',
            'gap-2',
            'selecao-etapa-actions-container'
        );

        container.style.maxWidth = '800px'; // Sets a maximum width for the buttons container

        const btnVoltar = document.createElement('button');
        btnVoltar.classList.add('btn', 'btn-secondary', 'mb-2');
        btnVoltar.textContent = 'VOLTAR ao menu inicial';
        
        const btnModelo = document.createElement('button');
        btnModelo.classList.add('btn', 'btn-primary', 'mb-2');
        btnModelo.textContent = 'BAIXAR MODELO de planilha padrão';

        const btnProsseguir = document.createElement('button');
        btnProsseguir.classList.add('btn', 'btn-primary', 'mb-2');
        btnProsseguir.textContent = 'PROSSEGUIR para o sorteio dos jurados';

        //Conecta os eventos às funções recebidas via handlers
        btnVoltar.addEventListener('click', this.handlers.onVoltar);
        btnModelo.addEventListener('click', this.handlers.onSolicitaPlanilhaModelo);
        btnProsseguir.addEventListener('click', this.handlers.onProsseguir);
        

        container.appendChild(btnVoltar);
        container.appendChild(btnModelo);
        container.appendChild(btnProsseguir);

        return container;
    }
}