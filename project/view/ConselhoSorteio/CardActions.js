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

        this.element = containerStatus;

        return containerStatus;
    }

    destroy(){
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