export class CardActions {
    /**
     * 
     * @param {Object} handlers - objeto com funções que são injetadas no elemento
     * @param {function} handlers.onApto - ação a realizar quando houver click no botão btnApto
     * @param {function} handlers.onImpedido - ação a realizar quando houver click no botão btnImpedidoSuspeito
     * @param {function} handlers.onDispensado - ação a realizar quando houver click no botão btnDispensado
     * @param {function} handlers.onAusente - ação a realizar quando houver click no botão btnAusente
     */
    constructor(handlers) {
        this.handlers = handlers;
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

        const btnAptoSorteio = document.createElement('button');
        btnAptoSorteio.classList.add('btn', 'btn-primary', 'ml-2', 'mr-1');
        btnAptoSorteio.textContent = 'PRESENTE';

        const btnImpedidoSuspeito = document.createElement('button');
        btnImpedidoSuspeito.classList.add('btn', 'btn-secondary', 'mx-1');
        btnImpedidoSuspeito.textContent = 'IMPEDIDO ou SUSPEITO';

        const btnDispensado = document.createElement('button');
        btnDispensado.classList.add('btn', 'btn-secondary', 'mx-1');
        btnDispensado.textContent = 'DISPENSADO';

        const btnAusente = document.createElement('button');
        btnAusente.classList.add('btn', 'btn-ausente', 'ml-1', 'mr-2');
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

        return containerStatus;
    }
}