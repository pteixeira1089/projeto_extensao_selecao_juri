export class NavActions {
    
    /**
     * 
     * @param {Object} handlers - handler object with functions to be injected in the buttons
     */
    constructor(handlers){
        this.handlers = handlers
    }

    create(){
        const container = document.createElement('div');

        container.classList.add(
            'body-paragraph',
            'mt-2',
            'mb-2',
            'mx-auto',
            'd-flex',
            'justify-content-center',
            'chamada-actions-container'
        );

        const btnAnterior = document.createElement('button');
        btnAnterior.classList.add('btn-secondary', 'btn-nav', 'mx-1');
        btnAnterior.textContent = '< Anterior';

        const btnProximo = document.createElement('button');
        btnProximo.classList.add('btn-secondary', 'btn-nav', 'mx-1');
        btnProximo.textContent = 'Próximo >';
        
        container.appendChild(btnAnterior);
        container.appendChild(btnProximo);

        return container;
    }
}