export class ListaPresencaActions {
    /**
     * 
     * @param {Object} handlers - objeto com funções que são injetadas no elemento
     * @param {function} handlers.onTitulares - ação a realizar quando houver click no botão Titulares
     * @param {function} handlers.onSuplentes - ação a realizar quando houver click no botão Suplentes
     */
    constructor(handlers) {
        this.handlers = handlers;
        this.element = null;
    }

    create() {
        const listaSelectorContainer = document.createElement('div');

        listaSelectorContainer.classList.add(
            'body-paragraph',
            'mt-1',
            'mb-3',
            'mx-auto',
            'd-flex',
            'justify-content-center', // Centraliza os botões no container
            'lista-actions-container',
            'gap-2' // Adiciona um espaçamento entre os botões
        );

        const btnTitulares = document.createElement('button');
        btnTitulares.classList.add('btn', 'btn-primary', 'btn-titulares');
        btnTitulares.textContent = 'Titulares';

        const btnSuplentes = document.createElement('button');
        btnSuplentes.classList.add('btn', 'btn-secondary', 'btn-suplentes');
        btnSuplentes.textContent = 'Suplentes';

        listaSelectorContainer.append(btnTitulares, btnSuplentes);

        //Injeta dependências aos eventos de click
        btnTitulares.addEventListener('click', this.handlers.onTitulares);
        btnSuplentes.addEventListener('click', this.handlers.onSuplentes);

        this.element = listaSelectorContainer;

        return listaSelectorContainer;
    }

    destroy(){
    }
}