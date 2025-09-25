import { DOMUtils } from "../../service/AuxiliarServices/DOMUtils.js";

export class CabecalhoConselhoStartScreen {
    /**
     * Creates a header element for the instructions of the 'Sorteio de Conselho de Sentença' step.
     * @returns {HTMLElement} - The header element containing the title of the screen.
     */
    create() {
        const header = document.createElement('div');
        header.classList.add('conselho-sentenca-screen', 'text-center', 'mb-5', 'ml-3', 'mr-3');

        const title = document.createElement('h3');
        title.textContent = 'SORTEIO DO CONSELHO DE SENTENÇA (2ª ETAPA)';
        title.classList.add('mb-3');

        const p1 = DOMUtils.createParagraph("Nesta etapa, você irá sortear os jurados que comporão o Conselho de Sentença, conforme previsto nos arts. 437 a 439 do Código de Processo Penal (CPP).");
        const p2 = DOMUtils.createParagraph("Você deve possuir um arquivo de planilha contendo os dados dos jurados titulares e seus suplentes, sorteados na 1ª etapa (Tribunal do Júri).");
        const p3 = DOMUtils.createParagraph("<b>Somente prossiga se possuir a planilha com os dados de jurados titulares e suplentes</b>");
        
        header.appendChild(title);
        header.appendChild(p1);
        header.appendChild(p2);
        header.appendChild(p3);

        return header;
    }
}