import { DOMUtils } from "../../service/AuxiliarServices/DOMUtils.js";

export class CabecalhoTribunalStartScreen {
    /**
     * Creates a header element for the choice of the step of the lottery the user is: 'Sorteio do Tribunal do Júri (1ª etapa)' or 'Sorteio do Conselho de Sentença (2ª etapa)'.
     * @returns {HTMLElement} - The header element containing the title of the screen.
     */
    create() {
        const header = document.createElement('div');
        header.classList.add('flux-screen', 'text-center', 'mb-5', 'ml-3', 'mr-3');

        const title = document.createElement('h3');
        title.classList.add('mb-4');
        title.textContent = 'SORTEIO DO TRIBUNAL DO JÚRI';

        const p1 = DOMUtils.createParagraph("Nesta etapa é feito o sorteio do Tribunal do Júri (titulares e suplentes). Trata-se de etapa ANTERIOR à sessão do Júri que define o Conselho de Sentença.");
        const p2 = DOMUtils.createParagraph("Você deve possuir um arquivo de planilha contendo a listagem dos jurados alistados, conforme previsto nos <b>artigos 425 e 426 do Código de Processo Penal (CPP)</b>.")
        const p3 = DOMUtils.createParagraph("A planilha utilizada deve estar no formato padrão, necessário para o correto funcionamento do sistema. Você pode baixar um modelo de planilha clicando no botão abaixo. Caso sua planilha já esteja no padrão exigido, você pode prosseguir para o sorteio.");
        const p4 = DOMUtils.createParagraph("<b>Escolha abaixo a etapa do sorteio que deseja realizar:</b>");
        
        header.appendChild(title);
        header.appendChild(p1);
        header.appendChild(p2);
        header.appendChild(p3);
        header.appendChild(p4);

        return header;
    }
}