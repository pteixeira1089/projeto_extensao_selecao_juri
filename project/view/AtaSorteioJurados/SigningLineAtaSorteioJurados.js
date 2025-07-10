import { appState } from '../../appState.js';

export class SigningLineAtaSorteioJurados {
    
    /**
     * 
     * @param {Object} signer -Object representing the signer data
     */
    constructor(signer = appState.signer || '(assinador não informado)') {
        this.signer = signer;
    }

    getSignerString(){
        //Safely handle cases where this.signer is a string (fallback)
        if (typeof this.signer === 'string') return this.signer

        return [this.signer.nome, this.signer.cargo, this.signer.matricula]
            .filter(Boolean) //Removes null/undefined/empty strings
            .join(', ');
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

        const signParagraph = document.createElement('p');
        signParagraph.classList.add('mb-3');
        signParagraph.innerHTML = `Eu, ${this.getSignerString()}, lavrei a presente ata.`;
        bodyDiv.appendChild(signParagraph);

        return bodyDiv;
    }
}