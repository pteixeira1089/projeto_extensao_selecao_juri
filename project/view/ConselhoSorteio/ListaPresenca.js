export class ListaPresenca {
    /**
     * Creates a div element that holds a list of jurados.
     * @param {string} tipo - Type of the list, e.g., 'Jurados Titulares' or 'Suplentes'.
     * @param {Array<Object>} jurados - An array of juror objects. Each object should have a 'nome' property.
     */
    constructor(tipo, jurados = []) { // É uma boa prática inicializar o array para evitar erros
        this.tipo = tipo;
        this.jurados = jurados;
    }

    create() {
        const container = document.createElement('div');
        container.classList.add('conselho-sorteio-lista', 'ml-3', 'mr-3');

        // --- Cabeçalho ---
        const header = document.createElement('div');
        header.classList.add('text-center', 'mb-4'); // Ajustei a margem para o cabeçalho

        const title = document.createElement('h3');
        title.textContent = 'INTIMADOS PARA A SESSÃO DO TRIBUNAL DO JÚRI';
        title.classList.add('mb-2');

        const subtitle = document.createElement('p');
        // Corrigido: usar this.tipo que foi salvo no construtor
        subtitle.innerHTML = `Tipo de lista: <b>${this.tipo}</b>`;

        header.appendChild(title);
        header.appendChild(subtitle);

        // --- Lista Ordenada ---
        const ol = document.createElement('ol');
        ol.classList.add('list-group', 'list-group-numbered'); // Usando classes do Bootstrap como exemplo

        this.jurados.forEach(jurado => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = jurado.nome; // Supondo que cada objeto jurado tenha uma propriedade 'nome'
            ol.appendChild(li);
        });

        // --- Montagem Final ---
        container.appendChild(header);
        container.appendChild(ol);

        return container;
    }
}