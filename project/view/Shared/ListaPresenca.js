import { JuradoSorteado } from "../../model/JuradoSorteado.js";
import { renderListaItem, removeListaItem } from "../../renderer/ComposicaoUrna.js";

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
    activeArray;

    /**
     * The callback function associated to each listaItem
     * @type { function }
     */
    onSelect;

    /**
     * The corresponding DOM element
     *  @type { HTMLElement } */
    element;


    /**
     * Creates a div element that holds a list of jurados.
     * @param { { juradosTitulares, juradosSuplentes } } props - arrays of juradosSuplentes and juradosSorteados
     * @param { JuradoSorteado[] } props.juradosTitulares - array of jurados titulares
     * @param { JuradoSorteado[] } props.juradosSuplentes - array of jurados suplentes
     * @param { function } props.onSelect - callback function associated to each listaItem
     */
    constructor({
        juradosTitulares: juradosTitulares = [],
        juradosSuplentes: juradosSuplentes = [],
        onSelect: onSelect
    }) { // É uma boa prática inicializar o array para evitar erros
        this.juradosTitulares = juradosTitulares;
        this.juradosSuplentes = juradosSuplentes;
        this.onSelect = onSelect;

        this.activeArray = this.juradosTitulares;

        this.element = null;
    }

    create() {
        if (!this.activeArray) {
            //Debugging
            console.log('Não foi informada uma lista de jurados titulares. Não é possível criar uma lista de presenças sem esse parâmetro.')
            return;
        }


        const container = document.createElement('div');
        container.classList.add('list-chamada', 'list-group', 'p-0');

        this.element = container;

        this.activeArray.forEach(jurado => {
            renderListaItem({
                juradoSorteado: jurado,
                target: this.element,
                onSelect: this.onSelect
            });
        });

        return container;
    }

    alternateItems() {
        //Debugging
        console.log('alternateItems method, do objeto ListaPresenca, acionado.')


        //Debugging
        console.log('iterando elementos do array de jurados ativo, na lista')
        this.activeArray.forEach(jurado => {
            //Debugging
            console.log('Jurado iterado:')
            console.log(jurado);
            console.log('Executando o renderer removeListaItem para o jurado informado');

            removeListaItem({ id: jurado.id });
        });

        if (this.activeArray === this.juradosTitulares) {
            this.activeArray = this.juradosSuplentes;
        } else {
            this.activeArray = this.juradosTitulares;
        };

        this.activeArray.forEach(jurado => {
            renderListaItem({
                juradoSorteado: jurado,
                target: this.element,
                onSelect: this.onSelect
            });
        });
    }
}
