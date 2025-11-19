import { DOMUtils } from "../../utils/DOMUtils.js";
import { CabecalhoConselhoSorteio } from "../ComposicaoUrna/CabecalhoConselhoSorteio.js";

export class ConselhoSkeleton {
    constructor() {
        this.content = document.getElementById('content');
    }

    static buildComposicaoUrnaSkeleton() {

        //Need to instantiate the constant because the method is static (independs of an instantiation - cannot use this properties)
        const content = document.getElementById('content');

        const chamadaContainer = DOMUtils.createDiv({
            divName: 'chamadaContainer',
            divClasses: ['row', 'w-100', 'mx-3', 'mt-3'] // Usamos a classe 'row' do Bootstrap para o layout
        });
        const listContainer = DOMUtils.createDiv({
            divName: 'listContainer',
            divClasses: ['col-md-4', 'col-lg-3'] // Ocupa 4 de 12 colunas em telas médias, e 3 em telas grandes
        });
        const cardContainer = DOMUtils.createDiv({
            divName: 'cardContainer',
            divClasses: ['col-md-8', 'col-lg-9'] // Ocupa o restante do espaço
        });
        //Card será renderizado em 'cardInfocontainer'
        //Navegação será renderizada em 'navContainer'
        const cardInfoContainer = DOMUtils.createDiv({ divName: 'cardInfoContainer' });
        const navContainer = DOMUtils.createDiv({ divName: 'navContainer' });

        // Cria um contêiner para a urna que segue o layout de grid
        const urnaRow = DOMUtils.createDiv({
            divName: 'urnaRow',
            divClasses: ['row', 'w-80', 'mx-3']
        });
        const urnaCol = DOMUtils.createDiv({
            divName: 'urnaCol',
            divClasses: ['col-12', 'urna-wrapper'] // Ocupa toda a largura e aplica o novo estilo
        });
        urnaRow.append(urnaCol);

        //Div para o título da página
        const titleContainer = new CabecalhoConselhoSorteio().create();

        const urnaTitleContainer = DOMUtils.createDiv({
            divName: 'urnaTitleContainer',
            divClasses: ['justify-content-center']
        });


        const urnaInfoContainer = DOMUtils.createDiv({
            divName: 'urnaInfoContainer',
            divClasses: ['justify-content-end']
        });




        // Anexe o esqueleto ao DOM de uma vez
        content.append(titleContainer, chamadaContainer);
        chamadaContainer.append(listContainer, cardContainer);
        cardContainer.append(cardInfoContainer, navContainer);
        content.append(urnaRow); // Adiciona a linha da urna ao conteúdo
    }
}

