export class InfoJuradoActions {
    /**
     * 
     * @param {Object} handlers - objeto com funções que são injetadas no elemento
     * @param {function} handlers.onClearStatus - ação a realizar quando houver click no botão btnClearStatus
     */
    constructor(handlers) {
        this.handlers = handlers;
        this.element = null;
    }

    create() {
        const btnClearStatus = document.createElement('button');
        btnClearStatus.textContent = `Limpar status`;
        btnClearStatus.addEventListener('click', this.handlers.onClearStatus);
        btnClearStatus.classList.add('btn-clear-status');

        const containerStatus = document.createElement('div');

        containerStatus.appendChild(btnClearStatus);

        this.element = containerStatus;

        return containerStatus;
    }

    destroy() {
        console.log('Destruindo o botão de ação de limpar status');

        //1. Limpe event listeners para evitar memory leaks (se houver)
        const classHandlers = {
            '.btn-clear-status': this.handlers.onClearStatus,
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