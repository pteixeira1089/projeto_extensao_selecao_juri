export class AcoesConselhoStartScreen {

    /**
     * @param {object} handlers - Objeto com funções de callback para os eventos
     * @param {function} handlers.onVoltarClick - Função a ser chamada quando o botão de voltar é pressionado
     * @param {function} handlers.onProsseguirClick - Função a ser chamada quando o botão de prosseguir é pressionado
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
            'justify-content-center',
            'gap-2',
            'selecao-etapa-actions-container'
        );

        container.style.maxWidth = '800px'; // Sets a maximum width for the buttons container

        const btnVoltar = document.createElement('button');
        btnVoltar.classList.add('btn', 'btn-secondary', 'mb-2');
        btnVoltar.textContent = 'Não possuo a planilha: Voltar';
        

        const btnProsseguir = document.createElement('button');
        btnProsseguir.classList.add('btn', 'btn-primary', 'mb-2');
        btnProsseguir.textContent = 'Possuo a planilha: Prosseguir';

        //Conecta os eventos às funções recebidas via handlers
        btnVoltar.addEventListener('click', this.handlers.onSorteioTribunalJuri);
        btnProsseguir.addEventListener('click', this.handlers.onConselhoSentenca);
        

        container.appendChild(btnVoltar);
        container.appendChild(btnProsseguir);

        return container;
    }
}