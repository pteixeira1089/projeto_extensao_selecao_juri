export class SortearJuradoButton {
    constructor() {
        this.element = null;
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

        container.append(button);

        this.element = container;

        return container;
    }
}