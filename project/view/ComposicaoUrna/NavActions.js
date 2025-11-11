export class NavActions {
    
    /**
     * 
     * @param {Object} handlers - handler object with functions to be injected in the buttons
     * @param {Function} handlers.onAnterior - callback function for anterior button
     * @param {Function} handlers.onProximo - callback fucntion for proximo button
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
        btnAnterior.addEventListener('click', this.handlers.onAnterior);

        const btnProximo = document.createElement('button');
        btnProximo.classList.add('btn-secondary', 'btn-nav', 'mx-1');
        btnProximo.textContent = 'Próximo >';
        btnProximo.addEventListener('click', this.handlers.onProximo);
        
        container.appendChild(btnAnterior);
        container.appendChild(btnProximo);

        return container;
    }
}