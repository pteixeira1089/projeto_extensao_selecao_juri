import { JuradoSorteado } from "../../model/JuradoSorteado.js";

/**
 * Um componente de visualização que exibe uma lista de jurados na "urna" 
 * para o Conselho de Sentença e um botão para sortear um jurado.
 */
export class UrnaConselho {

    /**
     * @type {JuradoSorteado[]}
     */
    jurados;

    /**
     * @type {Function}
     */
    onSortear;

    /**
     * O elemento DOM correspondente.
     * @type {HTMLElement | null}
     */
    element;

    /**
     * @param {object} props - Propriedades para inicializar o componente.
     * @param {JuradoSorteado[]} [props.jurados=[]] - O array de jurados a serem listados.
     * @param {Function} [props.onSortear=()=>{}] - A função de callback para o clique no botão de sorteio.
     */
    constructor({ jurados = [], onSortear = () => {} } = {}) {
        this.jurados = jurados;
        this.onSortear = onSortear;
        this.element = null;
    }

    create() {
        const mainContainer = document.createElement('div');
        mainContainer.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100', 'mt-4');

        const titulo = document.createElement('h5');
        titulo.innerText = 'Urna';

        // Container para a lista de jurados
        const listContainer = document.createElement('div');
        listContainer.classList.add('list-group', 'w-75');
        listContainer.id = 'urna-conselho-sentenca-container';

        if (this.jurados.length > 0) {
            this.jurados.forEach(jurado => {
                const listItem = document.createElement('a');
                listItem.href = '#';
                listItem.classList.add('list-group-item', 'list-group-item-action', 'text-center');
                listItem.dataset.juradoId = jurado.id;
                
                const nome = document.createElement('h6');
                nome.classList.add('mb-1');
                nome.textContent = jurado.nome;

                listItem.appendChild(nome);
                listContainer.appendChild(listItem);
            });
        } else {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Não há jurados na urna para o sorteio.';
            listContainer.appendChild(emptyMessage);
        }

        // Botão de ação
        const btnSortear = document.createElement('button');
        btnSortear.classList.add('btn', 'btn-primary', 'mt-4');
        btnSortear.textContent = 'Sortear Jurado';
        btnSortear.addEventListener('click', this.onSortear);

        mainContainer.append(titulo, listContainer, btnSortear);

        this.element = mainContainer;
        return this.element;
    }
}
