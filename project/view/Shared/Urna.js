import { TipoPage } from "../../model/enums/TipoPage";

export class Urna {

    /**
     * The corresponding DOM element
     * @type {HTMLElement}
     */
    element;

    /**
     * @param {Object} [handlers] - Optional object containing the event handlers.
     * @param {Function} [handlers.onProsseguir] - Callback for the 'prosseguir' button click.
     * @param {string | null} [handlers.tipoUrna] - defines the style of the Urna component
     */
    constructor(handlers = {}) {
        this.handlers = handlers;
        this.element = null;
        this.tipoUrna = handlers.tipoUrna ?? null;
        this.urnaCountText = handlers.tipoUrna === TipoPage.CONSELHO_SENTENCA ? 'Jurados sorteados: ' : 'Cédulas na urna: ';
        this.urnaActionButtonText = handlers.tipoUrna  === TipoPage.CONSELHO_SENTENCA ? 'Confirmar Conselho de Sentença' : 'Prosseguir (fechar urna)';
    }

    create() {
        // Wrapper that will contain the counter (texto alinhado à direita)
        // e a lista/contêiner da urna logo abaixo.
        const wrapper = document.createElement('div');
        wrapper.classList.add('urna-wrapper');

        // Contêiner do cabeçalho da urna (para o contador e o botão)
        const counterDiv = document.createElement('div');
        counterDiv.classList.add(
            'd-flex',
            'justify-content-end', // Alinha os itens à direita
            'align-items-center', // Alinha verticalmente
            'gap-3', // Adiciona um espaço entre o contador e o botão
            'mb-2' // Margem inferior
        );

        //Contador Urna
        const counterParagraph = document.createElement('p');
        counterParagraph.classList.add('urna-counter');
        counterParagraph.id = 'urna-count';

        // Texto inicial — o código que manipula a urna deverá atualizar este elemento
        const initialText = this.urnaCountText + '0';
        counterParagraph.textContent = initialText;

        //Contador Recusas defesa
        const counterRecusaDefesaParagraph = document.createElement('p');
        counterRecusaDefesaParagraph.classList.add('urna-counter-recusa');
        counterRecusaDefesaParagraph.id = 'urna-count-recusa-defesa';
        counterRecusaDefesaParagraph.innerText = 'Recusas restantes - defesa: 3'

        //Contador Recusas MPF
        const counterRecusaMPFParagraph = document.createElement('p');
        counterRecusaMPFParagraph.classList.add('urna-counter-recusa');
        counterRecusaMPFParagraph.id = 'urna-count-recusa-mpf';
        counterRecusaMPFParagraph.innerText = 'Recusas restantes - acusação: 3'

        //Botão de ação
        const btnProsseguir = document.createElement('button');
        btnProsseguir.classList.add('btn', 'btn-secondary');
        btnProsseguir.textContent = this.urnaActionButtonText;

        // Injeta a dependência do handler, se ele foi fornecido
        if (this.handlers.onProsseguir) {
            btnProsseguir.addEventListener('click', this.handlers.onProsseguir);
        }

        counterDiv.append(counterParagraph, btnProsseguir);

        if (this.tipoUrna === TipoPage.CONSELHO_SENTENCA){
            counterDiv.prepend(counterRecusaDefesaParagraph, counterRecusaMPFParagraph);
        }

        // Contêiner que já existia para armazenar os itens da urna (mantém classes e id)
        const urnaListContainer = document.createElement('div');
        urnaListContainer.classList.add('list-group', 'urna-container');
        urnaListContainer.id = 'urna-container';

        // Anexa o contador acima e a lista abaixo, como solicitado
        wrapper.appendChild(counterDiv);
        wrapper.appendChild(urnaListContainer);

        // Store the created element on the instance
        this.element = wrapper;

        return wrapper;
    }

    /**
     * Updates the text of the urna main counter.
     * @param {number} count - The new count to display.
     */
    updateUrnaCounter(count) {
        this.element.querySelector('#urna-count').textContent = `${this.urnaCountText}${count}`;
    }

    /**
     * Updates the text of the 'recusas defesa' counter.
     * @param {number} count - The new count to display.
     */
    updateRecusasDefesaCounter(count) {
        const counterElement = this.element.querySelector('#urna-count-recusa-defesa');
        if (counterElement) {
            counterElement.textContent = `Recusas restantes - defesa: ${count}`;
        }
    }

    updateRecusasAcusacaoCounter(count) {
        const counterElement = this.element.querySelector('#urna-count-recusa-mpf');
        if (counterElement) {
            counterElement.textContent = `Recusas restantes - acusação: ${count}`;
        }
    }
}