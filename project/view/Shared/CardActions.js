import { TipoPage } from "../../model/enums/TipoPage";

export class CardActions {
    /**
     * 
     * @param {Object} handlers - objeto com funções que são injetadas no elemento
     * @param {function | null} handlers.onApto - ação a realizar quando houver click no botão btnApto
     * @param {function | null} handlers.onImpedido - ação a realizar quando houver click no botão btnImpedidoSuspeito
     * @param {function | null} handlers.onDispensado - ação a realizar quando houver click no botão btnDispensado
     * @param {function | null} handlers.onAusente - ação a realizar quando houver click no botão btnAusente
     * @param {function | null} handlers.onRecusaAcusacao - ação a realizar quando houver click no botão de recusa imotivada pela acusação
     * @param {function | null} handlers.onRecusaDefesa - ação a realizar quando houver click no botão de recusa imotivada pela defesa
     * @param {function | null} handlers.onConfirmarJurado - ação a realizar quando houver click no botão de confirmação de jurado
     * @param {string} handlers.tipoCard - informa o tipo de card que deve ser gerado (composicaoUrna ou conselhoSentenca)
     */
    constructor(handlers) {
        // Extrai o tipo de card para uma propriedade da classe.
        this.tipoCard = handlers?.tipoCard;

        // Extrai cada handler para uma propriedade da classe, com uma função de fallback segura.
        // Isso unifica o padrão e torna o acesso mais simples e consistente no resto do código.
        this.onApto = handlers?.onApto ?? (() => alert('[view CardActions] onApto não injetado.'));
        this.onImpedido = handlers?.onImpedido ?? (() => alert('[view CardActions] onImpedido não injetado.'));
        this.onDispensado = handlers?.onDispensado ?? (() => alert('[view CardActions] onDispensado não injetado.'));
        this.onAusente = handlers?.onAusente ?? (() => alert('[view CardActions] onAusente não injetado.'));
        this.onRecusaAcusacao = handlers?.onRecusaAcusacao ?? (() => alert('[view CardActions] botão de recusa acusação foi clicado - INJETE DEPENDÊNCIAS'));
        this.onRecusaDefesa = handlers?.onRecusaDefesa ?? (() => alert('[view CardActions] botão de recusa defesa foi clicado - INJETE DEPENDÊNCIAS'));
        this.onConfirmarJurado = handlers?.onConfirmarJurado ?? (() => alert('[view CardActions] botão de confirmar jurado foi clicado - INJETE DEPENDÊNCIAS'));

        // A propriedade this.handlers não é mais necessária, pois todos os handlers foram extraídos.
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
            'align-items-center',
            'chamada-actions-container'
        );

        if (this.tipoCard == TipoPage.COMPOSICAO_URNA || !this.tipoCard) {

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
            btnAptoSorteio.addEventListener('click', this.onApto);
            btnImpedidoSuspeito.addEventListener('click', this.onImpedido);
            btnDispensado.addEventListener('click', this.onDispensado);
            btnAusente.addEventListener('click', this.onAusente);
        }

        if (this.tipoCard == TipoPage.CONSELHO_SENTENCA) {

            containerStatus.classList.add('flex-column');

            const btnRecusaImotivadaDefesa = document.createElement('button');
            btnRecusaImotivadaDefesa.classList.add('btn', 'mx-2', 'btn-recusa-defesa');
            btnRecusaImotivadaDefesa.textContent = 'Recusa imotivada - DEFESA';

            const btnRecusaImotivadaAcusacao = document.createElement('button');
            btnRecusaImotivadaAcusacao.classList.add('btn', 'mx-2', 'btn-recusa-acusacao');
            btnRecusaImotivadaAcusacao.textContent = 'Recusa imotivada - MPF';

            const btnConfirmarJurado = document.createElement('button');
            btnConfirmarJurado.classList.add('btn', 'btn-primary', 'mx-1', 'btn-confirmar-jurado');
            btnConfirmarJurado.textContent = 'CONFIRMAR Jurado';

            //Injeção de dependências
            btnRecusaImotivadaDefesa.addEventListener('click', this.onRecusaDefesa);
            btnRecusaImotivadaAcusacao.addEventListener('click', this.onRecusaAcusacao);
            btnConfirmarJurado.addEventListener('click', this.onConfirmarJurado);

            const containerRecusa = document.createElement('div');

            containerRecusa.classList.add(
                'body-paragraph',
                'mt-1',
                'mb-3',
                'mx-auto',
                'd-flex',
                'justify-content-center',
                'recusa-actions-container',
                'chamada-actions-container'
            )

            containerRecusa.append(btnRecusaImotivadaDefesa, btnRecusaImotivadaAcusacao);

            containerStatus.append(containerRecusa, btnConfirmarJurado);
        }

        this.element = containerStatus;

        return containerStatus;
    }

    destroy() {
        console.log('Destruindo os botões de ação do cardJurado');

        //1. Limpe event listeners para evitar memory leaks (se houver)
        const classHandlers = {
            '.btn-presente': this.onApto,
            '.btn-impedido-suspeito': this.onImpedido,
            '.btn-dispensado': this.onDispensado,
            '.btn-ausente': this.onAusente,
            // Adiciona os handlers para o card do tipo Conselho de Sentença
            '.btn-recusa-defesa': this.onRecusaDefesa,
            '.btn-recusa-acusacao': this.onRecusaAcusacao,
            '.btn-confirmar-jurado': this.onConfirmarJurado,
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