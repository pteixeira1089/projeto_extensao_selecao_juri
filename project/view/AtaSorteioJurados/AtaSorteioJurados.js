import { appState } from "../../appState.js";

export class AtaSorteioJurados {
    /**
     * 
     * @param {Object<number, Object>} juradosTitulares - object that stores jurados titulares
     * @param {Object<number, Object>} juradosSuplentes - object that stores jurados suplentes
     * @param {Object<number, Object>} presencas - object that stores presencas
     */
    
    constructor(
        juradosTitulares = {}, 
        juradosSuplentes = {}, 
        presencas = {}) {
            this.juradosTitulares = juradosTitulares;
            this.juradosSuplentes = juradosSuplentes;
            this.presencas = presencas;
    }

    getJurados() {
        return this.jurados;
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('ata-sorteio-jurados', 'ml-3', 'mr-3');
        container.style.width = '100%'; // Sets the width to 100%

        const title = document.createElement("h3");
        title.classList.add("mb-4");
        title.textContent = "Ata de sorteio dos jurados";

        const juradosList = document.createElement("ul");
        juradosList.classList.add("list-group");

        this.jurados.forEach(jurado => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = `${jurado.nome} (${jurado.cpf})`;
            juradosList.appendChild(listItem);
        });

        container.appendChild(title);
        container.appendChild(juradosList);

        return container;
    }
}

