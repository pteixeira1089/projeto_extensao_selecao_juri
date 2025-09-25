export class DOMUtils {
    /**
     * Creates a paragraph element with the given text.
     * @param {string} text - The text content for the paragraph.
     * @return {HTMLElement} - The created paragraph element.
     */
    static createParagraph(text) {
        const paragraph = document.createElement("p");
        paragraph.innerHTML = `${text}`;
        return paragraph;
    }
}