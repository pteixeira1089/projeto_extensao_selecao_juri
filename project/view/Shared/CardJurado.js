import { InfoJurado } from "./InfoJurado.js"
import { CardActions } from "./CardActions.js"
import { JuradoSorteado } from "../../model/JuradoSorteado.js";

import { PageComposer } from "../../renderer/PageComposer.js";
import { TipoCard } from "../../model/enums/TipoCard.js";

export class CardJurado {
    /**
     * 
     * @param {Object} props - Object containing a juradoSorteado Object and a handlers object, to instantiate the composing classes
     * @param {JuradoSorteado} props.juradoSorteado - object containing the juradoSorteado info {nome, profissao, cpf, status=null}
     * @param {Object} props.handlers - handlers to inject dependencies (functions) in the action buttons
     */
    constructor({ juradoSorteado, handlers }) {
        this.juradoInfo = new InfoJurado({
            id: juradoSorteado.id,
            nome: juradoSorteado.nome,
            profissao: juradoSorteado.profissao,
            cpf: juradoSorteado.cpf,
            status: juradoSorteado.status,
            onClearStatus: handlers.onClearStatus
        })
        this.actionButtons = new CardActions(handlers);

        this.element = null;
    }

    create() {
        //Instantiate a pageComposer to add the composing instances
        const pageComposer = new PageComposer(document.getElementById('content'))

        const container = document.createElement('div');
        container.classList.add('conselho-sorteio-card', 'w-80');

        // Container para as informações do jurado, que irá crescer e ocupar espaço
        const juradoInfoContainer = document.createElement('div');
        juradoInfoContainer.classList.add('jurado-info-container');
        const juradoInfoElement = pageComposer.addComponent(this.juradoInfo);
        juradoInfoContainer.appendChild(juradoInfoElement);

        const actionDiv = document.createElement('div');
        const actionButtonsElement = pageComposer.addComponent(this.actionButtons)
        actionDiv.appendChild(actionButtonsElement);

        container.appendChild(juradoInfoContainer)
        container.appendChild(actionDiv);

        this.element = container;

        return container
    }

    update({ juradoSorteado }) {
        if (juradoSorteado) {
            this.juradoInfo = new InfoJurado(this.juradoInfo);

            this.juradoInfo.update({ juradoSorteado });
        }
    }

    destroy() {
        console.log('Destruindo o componente juradoCard');

        this.juradoInfo.destroy();
        this.actionButtons.destroy();

        this.element.remove();

        this.element = null;
    }

}