
export class BodyAtaSorteioJurados {
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
        bodyParagraph.innerHTML = `Com as formalidades de praxe, o(a) MM. Juiz(a) Federal procedeu ao sorteio dos jurados aptos a atuarem na sessão periódica do júri, sendo sorteados os seguintes nomes, os quais serão convocados para comparecerem no dia e horário designados:`;
        bodyDiv.appendChild(bodyParagraph);

        return bodyDiv;
    }
}