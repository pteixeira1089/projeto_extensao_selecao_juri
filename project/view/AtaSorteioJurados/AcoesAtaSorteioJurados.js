export class AcoesAtaSorteioJurados {
    /**
     * @param {object} handlers - Objeto com funções de callback para os eventos
     * @param {function} handlers.onPrintClick - Função a ser chamada quando o botão de imprimir for clicado
     * @param {function} handlers.onGenerateXlsxClick - Função a ser chamada quando o botão de gerar planilha for clicado
     */
    constructor(handlers) {
        //A view recebe e armazena os handlers, mas não sabe o que eles fazem
        this.handlers = handlers || {};
    }

    
    /**
     * Creates the action buttons for the Ata de Sorteio dos Jurados.
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
            'ata-actions-container'
        );

        container.style.maxWidth = '800px'; // Sets a maximum width for the buttons container

        const btnPrint = document.createElement('button');
        btnPrint.classList.add('btn', 'btn-primary');
        btnPrint.textContent = 'Imprimir Ata';
        

        const btnGenerateXlsx = document.createElement('button');
        btnGenerateXlsx.classList.add('btn', 'btn-primary');
        btnGenerateXlsx.textContent = 'Gerar planilha de jurados sorteados';

        //Conecta os eventos às funções recebidas via handlers
        btnPrint.addEventListener('click', this.handlers.onPrintClick);
        btnGenerateXlsx.addEventListener('click', this.handlers.onGenerateXlsxClick);
        

        container.appendChild(btnPrint);
        container.appendChild(btnGenerateXlsx);

        return container;
    }
}