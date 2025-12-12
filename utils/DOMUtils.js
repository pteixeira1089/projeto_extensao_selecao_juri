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

    static createDiv({ divName: divId, divClasses = [] }) {
        const divElement = document.createElement("div");
        divElement.id = divId;

        if (divClasses.length > 0) {
            divElement.classList.add(...divClasses) //desserialize the array into arguments - spread operator
        }
        
        return divElement;
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

    static uploadFile() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx, .xls'; // Aceita apenas arquivos Excel

        return new Promise((resolve, reject) => {
            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error("Nenhum arquivo selecionado."));
                }
            };

            fileInput.click(); // Abre o diálogo de seleção de arquivo
        })
    }
}