// Controller/Manager Class
export class PageComposer {
    /**
     * @param {HTMLElement} insertionPoint - Where to insert components
     */
    constructor(insertionPoint = document.body) {
        this.insertionPoint = insertionPoint;
        this.components = [];
    }

    /**
     * Adds a component to the page
     * @param {Object} component - Component with create() method
     * @returns {HTMLElement} - The created element
     */
    addComponent(component) {
        const element = component.create();
        this.insertionPoint.appendChild(element);
        this.components.push(element);
        return element;
    }
}