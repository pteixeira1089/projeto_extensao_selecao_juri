import { JuradoSorteado } from "../../model/JuradoSorteado.js";

/**
 * Um componente de visualização que exibe a lista de suplentes de reserva,
 * a forma de convocação e os botões de ação relacionados.
 */
export class SuplentesReserva {

    /**
     * @type {JuradoSorteado[]}
     */
    jurados;

    /**
     * @type {string}
     */
    modoConvocacao;

    /**
     * @type {Function}
     */
    onAlternarModo;

    /**
     * @type {Function}
     */
    onConvocar;

    /**
     * O elemento DOM correspondente.
     * @type {HTMLElement | null}
     */
    element;

    /**
     * @param {object} props - Propriedades para inicializar o componente.
     * @param {JuradoSorteado[]} [props.jurados=[]] - O array de suplentes de reserva.
     * @param {string} [props.modoConvocacao=''] - O modo de convocação atual.
     * @param {Function} [props.onAlternarModo=()=>{}] - Callback para o botão 'Alternar'.
     * @param {Function} [props.onConvocar=()=>{}] - Callback para o botão 'Convocar'.
     */
    constructor({ jurados = [], modoConvocacao = '', onAlternarModo = () => {}, onConvocar = () => {} } = {}) {
        this.jurados = jurados;
        this.modoConvocacao = modoConvocacao;
        this.onAlternarModo = onAlternarModo;
        this.onConvocar = onConvocar;
        this.element = null;
    }

    create() {
        const mainContainer = document.createElement('div');
        mainContainer.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100', 'mt-4');

        const modoTexto = document.createElement('p');
        modoTexto.textContent = `Modelo de convocação: ${this.modoConvocacao}`;
        modoTexto.classList.add('fw-bold');

        const btnAlternar = document.createElement('button');
        btnAlternar.classList.add('btn', 'btn-secondary', 'mb-3');
        btnAlternar.textContent = 'Alternar Forma de Convocação';
        btnAlternar.addEventListener('click', this.onAlternarModo);

        const listContainer = document.createElement('div');
        listContainer.classList.add('list-group', 'w-75');
        listContainer.id = 'suplentes-reserva-container';

        if (this.jurados.length > 0) {
            this.jurados.forEach(jurado => {
                const listItem = document.createElement('div');
                listItem.classList.add('list-group-item', 'text-center');
                listItem.dataset.juradoId = jurado.id;
                listItem.textContent = jurado.nome;
                listContainer.appendChild(listItem);
            });
        } else {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Não há suplentes de reserva disponíveis.';
            listContainer.appendChild(emptyMessage);
        }

        const btnConvocar = document.createElement('button');
        btnConvocar.classList.add('btn', 'btn-primary', 'mt-4');
        btnConvocar.textContent = 'Convocar Suplente';
        btnConvocar.addEventListener('click', this.onConvocar);

        mainContainer.append(modoTexto, btnAlternar, listContainer, btnConvocar);

        this.element = mainContainer;
        return this.element;
    }
}