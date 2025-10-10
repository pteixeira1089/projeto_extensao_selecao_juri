import { JuradoSorteado } from "../../model/JuradoSorteado.js";
import { ListaPresencaItem } from "./ListaPresencaItem.js";
import { renderListaItem, removeListaItem } from "../../renderer/ConselhoSorteioRenderer.js";

/**
 * @typedef { import('../../model/JuradoSorteado.js').JuradoSorteado } JuradoSorteado - typedef to be used in this file
 */

export class ListaPresenca {
    //Declaring the class attributes so I can anottate its types

    /** @type { JuradoSorteado[] } */
    juradosTitulares;

    /** @type { JuradoSorteado[] } */
    juradosSuplentes;

    /** 
     * Holds the active list being shown by the element on the DOM
     * @type { JuradoSorteado[] }
     */
    activeList;

    /**
     * The corresponding DOM element
     *  @type { HTMLElement } */
    element;


    /**
     * Creates a div element that holds a list of jurados.
     * @param { { juradosTitulares, juradosSuplentes } } props - arrays of juradosSuplentes and juradosSorteados
     * @param { JuradoSorteado[] } props.juradosTitulares - array of jurados titulares
     * @param { JuradoSorteado[] } props.juradosSuplentes - array of jurados suplentes
     */
    constructor({
        juradosTitulares: juradosTitulares = [],
        juradosSuplentes: juradosSuplentes = []
    }) { // É uma boa prática inicializar o array para evitar erros
        this.juradosTitulares = juradosTitulares;
        this.juradosSuplentes = juradosSuplentes;

        this.activeList = this.juradosTitulares;

        this.element = null;
    }

    create() {
        const container = document.createElement('div');
        container.classList.add('list-chamada', 'list-group', 'p-0');

        this.element = container;

        this.activeList.forEach(jurado => {
            renderListaItem({
                juradoSorteado: jurado,
                target: this.element
            });
        });

        return container;
    }

    alternateItems() {
        this.activeList.forEach(jurado => {
            removeListaItem({id: jurado.id});
        });

        if (this.activeList === this.juradosTitulares) {
            this.activeList = this.juradosSuplentes;
        }

        if (this.activeList === this.juradosSuplentes) {
            this.activeList = this.juradosTitulares;
        }

        this.activeList.forEach(jurado => {
            renderListaItem({
                juradoSorteado: jurado,
                target: this.element
            });
        });
    }
}
