
export class BodyAtaSorteioJurados {
    
    constructor(texto){
        this.texto = texto || '(Texto não fornecido)';
    }
    /**
     * Creates the presence list element for the Ata de Sorteio dos Jurados.
     * @returns {HTMLElement} - The paragraphs element of the ata.
     */
    create() {
        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add(
            'body-paragraph', 
            'mt-5',
            'mb-4', 
            'mx-auto',  
            'text-justify'
        );

        bodyDiv.style.maxWidth = '800px'; // Sets a maximum width for the presence list

        const bodyParagraph = document.createElement('p');
        bodyParagraph.classList.add('mb-3');
        bodyParagraph.innerHTML = this.texto;
        bodyDiv.appendChild(bodyParagraph);

        return bodyDiv;
    }
}