export class AcoesAtaSorteioJurados {
    /**
     * Creates the action buttons for the Ata de Sorteio dos Jurados.
     * @returns {HTMLElement} - The div element that holds the action buttons.
     */
    create() {
        const container = document.createElement('div');
        container.classList.add(
            'body-paragraph',
            'mt-5',
            'mb-4',
            'mx-auto',
            'text-justify',
            'ata-actions-container'
        );

        container.style.maxWidth = '800px'; // Sets a maximum width for the buttons container

        const btnPrint = document.createElement('button');
        btnPrint.classList.add('btn', 'btn-primary', 'mr-2');
        btnPrint.textContent = 'Imprimir Ata';
        

        const btnGenerateXlsx = document.createElement('button');
        btnPrint.classList.add('btn', 'btn-primary', 'mr-2');
        btnPrint.textContent = 'Gerar planilha de jurados sorteados';
        

        container.appendChild(btnPrint);
        container.appendChild(btnGenerateXlsx);

        return container;
    }
}