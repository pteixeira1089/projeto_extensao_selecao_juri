import { TipoCard } from "../../model/enums/TipoCard";

export class CardActions {
    /**
     * 
     * @param {Object} handlers - objeto com funções que são injetadas no elemento
     * @param {function} handlers.onApto - ação a realizar quando houver click no botão btnApto
     * @param {function} handlers.onImpedido - ação a realizar quando houver click no botão btnImpedidoSuspeito
     * @param {function} handlers.onDispensado - ação a realizar quando houver click no botão btnDispensado
     * @param {function} handlers.onAusente - ação a realizar quando houver click no botão btnAusente
     * @param {string} handlers.tipoCard - informa o tipo de card que deve ser gerado (composicaoUrna ou conselhoSentenca)
     */
    constructor(handlers) {
        this.handlers = handlers;
        this.tipoCard = handlers.tipoCard;
        this.element = null;
    }

    create() {
        const containerStatus = document.createElement('div');

        containerStatus.classList.add(
            'body-paragraph',
            'mt-1',
            'mb-3',
            'mx-auto',
            'd-flex',
            'justify-content-center',
            'chamada-actions-container'
        );

        if (this.tipoCard == TipoCard.COMPOSICAO_URNA || !this.tipoCard) {

            const btnAptoSorteio = document.createElement('button');
            btnAptoSorteio.classList.add('btn', 'btn-primary', 'ml-2', 'mr-1', 'btn-presente');
            btnAptoSorteio.textContent = 'PRESENTE';

            const btnImpedidoSuspeito = document.createElement('button');
            btnImpedidoSuspeito.classList.add('btn', 'btn-secondary', 'mx-1', 'btn-impedido-suspeito');
            btnImpedidoSuspeito.textContent = 'IMPEDIDO ou SUSPEITO';

            const btnDispensado = document.createElement('button');
            btnDispensado.classList.add('btn', 'btn-secondary', 'mx-1', 'btn-dispensado');
            btnDispensado.textContent = 'DISPENSADO';

            const btnAusente = document.createElement('button');
            btnAusente.classList.add('btn', 'btn-ausente', 'ml-1', 'mr-2', 'btn-ausente');
            btnAusente.textContent = 'AUSENTE';

            containerStatus.appendChild(btnAptoSorteio);
            containerStatus.appendChild(btnImpedidoSuspeito);
            containerStatus.appendChild(btnDispensado);
            containerStatus.appendChild(btnAusente);


            //Injeta dependências aos eventos de click
            btnAptoSorteio.addEventListener('click', this.handlers.onApto);
            btnImpedidoSuspeito.addEventListener('click', this.handlers.onImpedido);
            btnDispensado.addEventListener('click', this.handlers.onDispensado);
            btnAusente.addEventListener('click', this.handlers.onAusente);
        }

        if (this.tipoCard == TipoCard.CONSELHO_SENTENCA) {
            const btnRecusaImotivadaDefesa = document.createElement('button');
            btnRecusaImotivadaDefesa.classList.add('btn', 'ml-2', 'mr-1', 'btn-ausente');
            btnRecusaImotivadaDefesa.textContent = 'Recusa imotivada - DEFESA';

            const btnRecusaImotivadaAcusacao = document.createElement('button');
            btnRecusaImotivadaAcusacao.classList.add('btn', 'btn-secondary', 'mx-1', 'btn-ausente');
            btnRecusaImotivadaAcusacao.textContent = 'Recusa imotivada - MPF';

            const btnDispensado = document.createElement('button');
            btnDispensado.classList.add('btn', 'btn-primary', 'mx-1', 'btn-presente');
            btnDispensado.textContent = 'CONFIRMAR Jurado';

            const containerRecusa = document.createElement('div');

            containerRecusa.classList.add(
                'body-paragraph',
                'mt-1',
                'mb-3',
                'mx-auto',
                'd-flex',
                'flex-column',
                'justify-content-center',
                'recusa-actions-container',
                'chamada-actions-container'
            )

            containerRecusa.append(btnRecusaImotivadaDefesa, btnRecusaImotivadaAcusacao);

            containerStatus.append(containerRecusa, btnDispensado);
        }

        this.element = containerStatus;

        return containerStatus;
    }

    destroy() {
        console.log('Destruindo os botões de ação do cardJurado');

        //1. Limpe event listeners para evitar memory leaks (se houver)
        const classHandlers = {
            '.btn-presente': this.handlers.onApto,
            '.btn-impedido-suspeito': this.handlers.onImpedido,
            '.btn-dispensado': this.handlers.onDispensado,
            '.btn-ausente': this.handlers.onAusente
        }

        Object.entries(classHandlers).forEach(([className, handler]) => {
            const button = this.element.querySelector(className);
            if (button) { //verifica se o botão foi encontrado
                button.removeEventListener('click', handler);
            }
        })

        //2. Remove o elemento do DOM
        this.element.remove();

        //3. (Opcional) Limpa a referência ao elemento no próprio objeto
        this.element = null;
    }
}