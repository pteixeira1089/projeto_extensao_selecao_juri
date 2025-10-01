export class BasicHTMLElement {
    /**
     * @param {Object} props - Propriedades para o elemento
     * @param {string} props.tagName - A tag HTML a ser criada (ex: 'div', 'p', 'section')
     * @param {string} [props.elementId] - O ID do elemento
     * @param {string[]} [props.elementClasses=[]] - As classes CSS
     */
    constructor({ tagName, elementId, elementClasses = [] }) {
        this.tagName = tagName;
        this.elementId = elementId;
        this.elementClasses = elementClasses;
    }

    create() {
        const element = document.createElement(this.tagName);
        if (this.elementId) {
            element.id = this.elementId;
        }
        if (this.elementClasses.length > 0) {
            element.classList.add(...this.elementClasses);
        }
        return element;
    }
}