export class CabecalhoConselhoSorteio {
    /**
     * Creates a header element for the Sorteio de Conselho de Sentença Page.
     * @returns {HTMLElement} - The header element containing the title.
     */
    create() {
        const header = document.createElement('div');
        header.classList.add('conselho-sorteio-cabecalho', 'text-center', 'mb-5', 'ml-3', 'mr-3');

        const title = document.createElement('h2');
        title.textContent = 'SORTEIO DOS MEMBROS DO CONSELHO DE SENTENÇA';
        title.classList.add('mb-2');

        const subtitle = document.createElement('p');
        subtitle.innerHTML = '(Art. 469 e seguintes do Código de Processo Penal)';
        
        const date = document.createElement('p');
        date.innerHTML = `<strong>Data:</strong> ${new Date().toLocaleDateString()} <strong>Horário:</strong> ${new Date().toLocaleTimeString()}`;

        header.appendChild(title);
        header.appendChild(subtitle);
        header.appendChild(date);

        return header;
    }
}