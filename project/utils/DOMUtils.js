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


    static downloadBlob(blobFile, fileName) {
        try {
            const url = URL.createObjectURL(blobFile);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Libera a memória
        } catch (error) {
            console.log("Erro ao tentar baixar o arquivo ", fileName, ":");
            console.error(error);
        }
    }
}