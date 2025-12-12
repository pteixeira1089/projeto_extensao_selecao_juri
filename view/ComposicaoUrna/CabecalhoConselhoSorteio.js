import { DOMUtils } from "../../utils/DOMUtils.js";

export class CabecalhoConselhoSorteio {
    /**
     * Creates a header element for the Sorteio de Conselho de Sentença Page.
     * @returns {HTMLElement} - The header element containing the title.
     */
    create() {
        const titleContainer = DOMUtils.createDiv({
            divName: 'titleContainer',
            divClasses: ['justify-content-center', 'mb-3']
        });

        const title = document.createElement('h3');
        title.textContent = 'COMPOSIÇÃO DE URNA';

        const subtitle = document.createElement('small');
        subtitle.textContent = '(Art. 469 e seguintes do Código de Processo Penal)';

        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);

        return titleContainer;
    }
}