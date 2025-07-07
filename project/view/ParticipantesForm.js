import { DropdownInputWithType } from "./DropdownInputWithType.js";


export class ParticipantesForm {
/**
 * 
 * @param {Function} onProceedCallback - Callback function that calls the next screen logic
 */
    constructor(onProceedCallback) {
        this.participantes = [];
        this.onProceedCallback = onProceedCallback; // Callback to proceed to the next screen
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
            magistrado: 'Magistrado(a)',
            membroMP: 'Membro do MP',
            assistenteAcusacao: 'Assistente de acusação',
            representanteOAB: 'Representante da OAB',
            defensorConstituido: 'Defensor(a) constituído',
            defensorPublico: 'Defensor(a) Público(a)',
            servidor: 'Servidor(a)',
        };

        const participantesDiv = document.createElement("div");
        participantesDiv.classList.add('d-flex', 'flex-column', 'gap-3');

        const tiposKeys = Object.keys(tiposParticipante);

        tiposKeys.forEach((key, index) => {
            const dropdownInput = new DropdownInputWithType(
                'Selecione o tipo de participante',
                tiposParticipante,
                index,
                true,
                (removedComponent) => {
                    // Callback para remoção de participante
                    this.participantes = this.participantes.filter(p => p !== removedComponent);
                    console.log(`Participante removido: ${removedComponent.getSelectedTipo()} - ${removedComponent.getNomeParticipante()}`);
                }
            );
            participantesDiv.appendChild(dropdownInput.getElement());

            //Add the element to participantes array
            this.addParticipante(dropdownInput);
        });

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'mt-4');

        // Botão de adicionar participante
        const addParticipantButton = document.createElement('button');
        addParticipantButton.textContent = '+ Adicionar participante';
        addParticipantButton.className = 'btn btn-secondary mb-3';
        addParticipantButton.addEventListener('click', () => {
            const newDropdown = new DropdownInputWithType(
                'Selecione o tipo de participante',
                tiposParticipante,
                null, // Não preseleciona nenhum tipo
                false, // Permite mudar o tipo
                (removedComponent) => {
                    // Callback para remoção de participante
                    this.participantes = this.participantes.filter(p => p !== removedComponent);
                    console.log(`Participante removido: ${removedComponent.getSelectedTipo()} - ${removedComponent.getNomeParticipante()}`);
                }
            );
            participantesDiv.appendChild(newDropdown.getElement());

            // Adiciona o novo participante ao array
            this.addParticipante(newDropdown);
        });

        // Botão de prosseguir
        const botaoProsseguir = document.createElement('button');
        botaoProsseguir.textContent = 'Prosseguir';
        botaoProsseguir.className = 'btn btn-primary mb-3';
        botaoProsseguir.addEventListener('click', () => {
            const participantes = this.getParticipantes();
            console.log(participantes.map(p => ({
                tipo: p.getSelectedTipo(),
                nome: p.getNomeParticipante()
            })));

            if (typeof this.onProceedCallback === 'function') {
                this.onProceedCallback(); // Chama o callback para mudar de página
            }
        });

        buttonsWrapper.appendChild(addParticipantButton);
        buttonsWrapper.appendChild(botaoProsseguir);


        container.appendChild(horizontalRule);
        container.appendChild(title);
        container.appendChild(participantesDiv);
        container.appendChild(buttonsWrapper);

        return container;
    }
}