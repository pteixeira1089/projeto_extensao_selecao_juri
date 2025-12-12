export class AcoesSelecaoEtapa {

    /**
     * @param {object} handlers - Objeto com funções de callback para os eventos
     * @param {function} handlers.onSorteioTribunalJuri - Função a ser chamada quando o botão de sorteio do Tribunal do Júri (1ª etapa) for clicado
     * @param {function} handlers.onConselhoSentenca - Função a ser chamada quando o botão sorteio do Conselho de Sentença (2ª etapa) for clicado
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

        const btnEtapa1 = document.createElement('button');
        btnEtapa1.classList.add('btn', 'btn-primary', 'mb-2');
        btnEtapa1.textContent = 'Primeira etapa: Sorteio do Tribunal do Júri (titulares e suplentes)';
        

        const btnEtapa2 = document.createElement('button');
        btnEtapa2.classList.add('btn', 'btn-primary', 'mb-2');
        btnEtapa2.textContent = 'Segunda etapa: Sorteio do Conselho de Sentença';

        //Conecta os eventos às funções recebidas via handlers
        btnEtapa1.addEventListener('click', this.handlers.onSorteioTribunalJuri);
        btnEtapa2.addEventListener('click', this.handlers.onConselhoSentenca);
        

        container.appendChild(btnEtapa1);
        container.appendChild(btnEtapa2);

        return container;
    }
}