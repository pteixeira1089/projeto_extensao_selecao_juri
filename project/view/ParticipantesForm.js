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

        // Render logic for participantes goes here

        return container;
    }
}