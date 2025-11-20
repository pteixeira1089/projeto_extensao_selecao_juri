export class OptionSelector {

    constructor() {
        this.element = null;
    }

    /**
     * 
     * @param {object} strOptions 
     * @param {number | null} selectedIndex - indicates the index of the active (selected) option when the element is created
     * @returns {HTMLElement} - returns a li
     */
    buildSimpleOptionList(strOptions, selectedIndex) {
        const optionList = document.createElement('ul');

        Object.entries(strOptions).forEach(([option, onSelectFunction], iterationIndex) => {
            const li = document.createElement('li');
            li.innerText = option;

            const isfunction = typeof onSelectFunction === 'function';
            const handler = isfunction ? onSelectFunction : null;

            if (iterationIndex === selectedIndex) {
                li.classList.add('selected');
            }

            li.addEventListener('click', handler);

            li.addEventListener('click', () => {
                // Busca apenas o elemento que já está selecionado dentro desta lista específica
                const previouslySelected = optionList.querySelector('.selected');

                // Se houver um selecionado e não for o próprio elemento clicado...
                if (previouslySelected && previouslySelected !== li) {
                    previouslySelected.classList.remove('selected');
                }

                // Adiciona a classe ao clicado
                li.classList.add('selected');
            });

            optionList.appendChild(li);
        })

        optionList.classList.add(
            'simple-option-list'
        )

        this.element = optionList;

        return optionList;
    }
}