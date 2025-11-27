export class SortearJuradoButton {
    /**
     * 
     * @param {function} callbackFunction - callback that is triggered when the button is clicked
     */
    constructor(callbackFunction = () => alert('[SortearJuradoButton] Botão clicado: INJETE DEPENDÊNCIAS!')) {
        this.element = null;
        this.callbackFunction = callbackFunction;
    }

    create() {
        const container = document.createElement('div');

        container.classList.add(
            'd-flex',
            'align-items-center',
            'justify-content-center',
            'mb-3'
        );

        const button = document.createElement('button');

        button.classList.add(
            'btn-sortear-jurado',
            'btn-primary'
        );

        button.innerText = 'SORTEAR JURADO';

        button.addEventListener('click', this.callbackFunction);

        container.append(button);

        this.element = container;

        return container;
    }
}