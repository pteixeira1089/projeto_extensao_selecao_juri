import { appState } from '../../appState.js';

export class ListagemSorteadosAtaSorteioJurados {


    /**
     * 
     * @param string cabecalho - The header for the sorteados list, defaults to 'TITULARES'.
     * @param {[Object]} sorteados - Array of objects representing the jurados sorteados.
     */
    constructor(
        sorteados = appState.juradosTitularesData || [], // Default to appState.juradosTitularesData if not provided
        cabecalho = 'TITULARES' // Default to 'TITULARES' if not provided
    ) {
        this.sorteados = sorteados;
        this.cabecalho = cabecalho;
    }

    /**
     * Creates the sorteados list element for the Ata de Sorteio dos Jurados.
     * @returns {HTMLElement} - The paragraphs elements containing the list of sorteados.
     */
    create() {
        const sorteados = document.createElement('div');
        sorteados.classList.add(
            'ata-sorteio-jurados-sorteados', 
            'mb-4', 
            'mx-auto',  
            'text-justify'
        );

        sorteados.style.maxWidth = '800px'; // Sets a maximum width for the presence list

        if (this.sorteados.length === 0) {
            const noSorteados = document.createElement('p');
            noSorteados.textContent = 'Nenhum jurado sorteado.';
            sorteados.appendChild(noSorteados);
            return sorteados;
        }

        const qttSorteados = this.sorteados.length;

        const title = document.createElement('p');
        title.classList.add('mb-3');
        title.innerHTML = `<strong><u>${this.cabecalho} (${qttSorteados} nomes)</u></strong>`;
        
        const juradosList = document.createElement('ul');

        this.sorteados.forEach(jurado => {
            const juradoListItem = document.createElement('li');
            juradoListItem.innerHTML = `<strong>${jurado.nome}</strong> (${jurado.profissao})`;
            juradosList.appendChild(juradoListItem);
        });

        sorteados.appendChild(title);
        sorteados.appendChild(juradosList);

        

        return sorteados;
    }
}