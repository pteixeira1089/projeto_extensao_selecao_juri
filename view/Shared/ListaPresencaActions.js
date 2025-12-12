export class ListaPresencaActions {
    /**
     * 
     * @param {Object} handlers - objeto com funções que são injetadas no elemento
     * @param {function} handlers.onPrimaryButton - ação a realizar quando houver click no botão Titulares
     * @param {function} handlers.onSecondaryButton - ação a realizar quando houver click no botão Suplentes
     * @param {string} handlers.primaryButtonText - text to be shown in the first button
     * @param {string} handlers.secondaryButtonText - text to be shown in the second button
     */
    constructor({onPrimaryButton, onSecondaryButton, primaryButtonText = "Titulares", secondaryButtonText = "Suplentes"} = {}) {
        
        this.onPrimaryButton = onPrimaryButton;
        this.onSecondaryButton = onSecondaryButton;
        this.primaryButtonText = primaryButtonText;
        this.secondaryButtonText = secondaryButtonText;
        
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
        btnTitulares.textContent = this.primaryButtonText;

        const btnSuplentes = document.createElement('button');
        btnSuplentes.classList.add('btn', 'btn-secondary', 'btn-suplentes');
        btnSuplentes.textContent = this.secondaryButtonText;

        listaSelectorContainer.append(btnTitulares, btnSuplentes);

        //Injeta dependências aos eventos de click
        btnTitulares.addEventListener('click', this.onPrimaryButton);
        btnSuplentes.addEventListener('click', this.onSecondaryButton);

        this.element = listaSelectorContainer;

        return listaSelectorContainer;
    }

    destroy(){
    }
}