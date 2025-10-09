import { JuradoSorteado } from "../../model/JuradoSorteado.js";
import { ListaPresencaItem } from "./ListaPresencaItem.js";
import { renderListaItem } from "../../renderer/ConselhoSorteioRenderer.js";

/**
 * @typedef { import('../../model/JuradoSorteado.js').JuradoSorteado } JuradoSorteado - typedef to be used in this file
 */

export class ListaPresenca {
    /**
     * Creates a div element that holds a list of jurados.
     * @param { { jurados: JuradoSorteado[] } } jurados - an object containing a JuradoSorteado instance
     */
    constructor({jurados: jurados = [] }) { // É uma boa prática inicializar o array para evitar erros
        this.jurados = jurados;

        this.element = null;
    }

    create() {
        const container = document.createElement('div');
        container.classList.add('list-chamada', 'list-group', 'p-0');

        this.element = container;

        this.jurados.forEach(jurado => {
            renderListaItem({juradoSorteado: jurado, target: this.element});
       });

        return container;
    }
}