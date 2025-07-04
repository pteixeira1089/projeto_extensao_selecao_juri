import { DropdownInputWithType } from "./DropdownInputWithType.js";

export class ParticipantesForm {
    constructor() {
        this.participantes = [];
    }

    addParticipante(participante) {
        this.participantes.push(participante);
    }

    getParticipantes() {
        return this.participantes;
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('participantes-form', 'ml-3', 'mr-3');
        container.style.width = '100%'; // Sets the width to 100%

        const horizontalRule = document.createElement("hr");
        const title = document.createElement("h3");
        title.classList.add("mb-4");
        title.textContent = "Participantes da audiência";

        const tiposParticipante = {
            magistradoPresidente: 'Magistrado(a) presidente',
            magistrado: 'Magistrado(a)',
            membroMP: 'Membro do MP',
            assistenteAcusacao: 'Assistente de acusação',
            representanteOAB: 'Representante da OAB',
            defensorConstituido: 'Defensor(a) constituído',
            defensorPublico: 'Defensor(a) Público(a)'
        };

        const participantesDiv = document.createElement("div");
        participantesDiv.classList.add('d-flex', 'flex-column', 'gap-3');

        const tiposKeys = Object.keys(tiposParticipante);

        tiposKeys.forEach((key, index) => {
            const dropdownInput = new DropdownInputWithType(
                'Selecione o tipo de participante',
                tiposParticipante, 
                index
            );
            participantesDiv.appendChild(dropdownInput.getElement());
        });
        
        container.appendChild(horizontalRule);
        container.appendChild(title);
        container.appendChild(participantesDiv);

        return container;
    }
}