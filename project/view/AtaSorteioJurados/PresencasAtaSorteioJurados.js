import { appState } from '../../appState.js';

export class PresencasAtaSorteioJurados {


    /**
     * 
     * @param {[Object]} presencas - Array of objects representing the presences of participants.
     */
    constructor(
        presencas = appState.substituicoes || [] // Default to appState.participantesData if not provided
    ) {
        this.presencas = presencas;
    }

    /**
     * Creates the presence list element for the Ata de Sorteio dos Jurados.
     * @returns {HTMLElement} - The paragraphs elements containing the list of presences.
     */
    create() {
        const presencas = document.createElement('div');
        presencas.classList.add(
            'ata-sorteio-jurados-presencas', 
            'mb-4', 
            'mx-auto',  
            'text-justify'
        );

        presencas.style.maxWidth = '800px'; // Sets a maximum width for the presence list

        const mappingTipoParticipante = {
            magistrado: 'Magistrado(a)',
            membroMP: 'Membro do MP',
            assistenteAcusacao: 'Assistente de acusação',
            representanteOAB: 'Representante da OAB',
            defensorConstituido: 'Defensor(a) constituído',
            defensorPublico: 'Defensor(a) Público(a)',
            servidor: 'Servidor(a)'
        }

        if (this.presencas.length === 0) {
            const noPresences = document.createElement('p');
            noPresences.textContent = 'Nenhum participante presente.';
            presencas.appendChild(noPresences);
            return presencas;
        }

        const title = document.createElement('p');
        title.classList.add('mb-3');
        title.innerHTML = '<strong><u>Presenças:</u></strong>';
        presencas.appendChild(title);
        
        this.presencas.forEach(participante => {
            const presenceItem = document.createElement('p');
            const tipoParticipante = mappingTipoParticipante[participante.tipo] || participante.tipo;
            presenceItem.innerHTML = `<strong>${tipoParticipante}:</strong> ${participante.nome}`;
            presencas.appendChild(presenceItem);
        });

        return presencas;
    }
}