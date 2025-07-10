export class CabecalhoAtaSorteioJurados {
    /**
     * Creates a header element for the Ata de Sorteio dos Jurados.
     * @returns {HTMLElement} - The header element containing the title and date.
     */
    create() {
        const header = document.createElement('div');
        header.classList.add('ata-sorteio-jurados-cabecalho', 'text-center', 'mb-5', 'ml-3', 'mr-3');

        const title = document.createElement('h2');
        title.textContent = 'ATA DA SESSÃO DE SORTEIO DOS JURADOS';
        title.classList.add('mb-2');

        const subtitle = document.createElement('p');
        subtitle.innerHTML = '(Art. 432 e seguintes do Código de Processo Penal)';
        
        const date = document.createElement('p');
        date.innerHTML = `<strong>Data:</strong> ${new Date().toLocaleDateString()} <strong>Horário:</strong> ${new Date().toLocaleTimeString()}`;

        header.appendChild(title);
        header.appendChild(subtitle);
        header.appendChild(date);

        return header;
    }
}