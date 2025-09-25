import { DOMUtils } from "../../service/AuxiliarServices/DOMUtils.js";

export class CabecalhoSelecaoEtapa {
    /**
     * Creates a header element for the choice of the step of the lottery the user is: 'Sorteio do Tribunal do Júri (1ª etapa)' or 'Sorteio do Conselho de Sentença (2ª etapa)'.
     * @returns {HTMLElement} - The header element containing the title of the screen.
     */
    create() {
        const header = document.createElement('div');
        header.classList.add('flux-screen', 'text-center', 'mb-5', 'ml-3', 'mr-3');

        const title = document.createElement('h3');
        title.textContent = 'Sistema Eletrônico de Sorteio do Júri';
        title.classList.add('mb-3');

        const p1 = DOMUtils.createParagraph("O Sistema Eletrônico de Sorteio de Júri surgiu com a finalidade de informatizar o procedimento de sorteio dos jurados, previsto nos arts. 432 a 472 do Código de Processo Penal (CPP).");
        const p2 = DOMUtils.createParagraph("<b>Escolha abaixo a etapa do sorteio que deseja realizar:</b>");
        
        header.appendChild(title);
        header.appendChild(p1);
        header.appendChild(p2);

        return header;
    }
}