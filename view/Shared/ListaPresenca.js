import { JuradoSorteado } from "../../model/JuradoSorteado.js";
import { ListaPresencaItem } from "../Shared/ListaPresencaItem.js";
import { ListaTipo } from "../../model/enums/ListaPresencaConstants.js";

/**
 * @typedef { import('../../model/JuradoSorteado.js').JuradoSorteado } JuradoSorteado - typedef to be used in this file
 */

/**
 * @typedef { Object } ListaItemRegister
 * @property { ListaPresencaItem } listaItem - instância de listaPresencaItem
 * @property { boolean } visible - controla se o item está visível ou não
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
     * @type { Map<string | number, ListaItemRegister }
     */
    activeListaItems;

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
        this.activeListaItems = new Map();
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

        // Limpa o container antes de renderizar
        this.element.innerHTML = '';

        this.activeArray.forEach(juradoSorteado => {
            this.renderListaItem({ juradoSorteado, onSelect: this.onSelect });
        });

        return container;
    }

    /**
     * 
     * @param { object } props
     * @param { JuradoSorteado } props.juradoSorteado - juror for which a listItem is going to be rendered
     * @param { function } props.onSelect - callback to be vinculated to the listaPresencaItem onClick event
     * @returns { ListaPresencaItem | null}
     */
    renderListaItem({ juradoSorteado, onSelect }) {
        //Debugging messages
        console.log('[view ListaPresenca] Executando renderer renderListaItem para o jurado abaixo:');
        console.log(juradoSorteado);

        //Necessário verificar se o elemento já foi gerado
        const listaItemRegCheck = this.activeListaItems.get(juradoSorteado.id);

        if (listaItemRegCheck && listaItemRegCheck.visible) {
            //Debugging messages
            console.log(`[view ListaPresenca] Já existe um listaItem para este jurado - operação cancelada.`);
            return;
        }

        //Cria e registra um novo listaItem
        const newListaItem = new ListaPresencaItem({
            jurado: juradoSorteado,
            onSelect: onSelect
        });

        const newListaItemElement = newListaItem.create();
        this.element.appendChild(newListaItemElement);

        const listaItemReg = {
            listaItem: newListaItem,
            visible: true
        }

        this.activeListaItems.set(juradoSorteado.id, listaItemReg); //IMPORTANTE: registra o objeto
    }

    updateListaItem({ juradoSorteado }) {
        //Debugging messages
        console.log('[view ListaPresenca] executando método updateListaItem para o jurado abaixo:')
        console.log(juradoSorteado)

        const listaItemInstance = this.activeListaItems.get(juradoSorteado.id).listaItem;

        if (!listaItemInstance) {
            //Debugging messages
            console.log(`[view ListaItem] Não foi encontrado um elemento para o jurado de id ${juradoSorteado.id}. Operação cancelada`);
            return; // A instância pode não existir se a lista foi trocada, então apenas retornamos.
        }

        listaItemInstance.update(juradoSorteado);
    }

    removeListaItem({ id }) {
        //Debugging messages
        console.log(`[view component ListaPresenca] Iniciando remoção de listaItem para o jurado de id ${id}`)

        //1. Procura pela instância do objeto listaItem correspondente
        const listaItemReg = this.activeListaItems.get(id);

        if (!listaItemReg) {
            //Debugging message
            console.log(`[view component ListaPresenca] Não há listaItem instanciado para o jurado de id ${id}. Operação não realizada.`)
            return;
        }

        listaItemReg.listaItem.remove();
        listaItemReg.visible = false;

        //Debugging message
        console.log(`[view component ListaPresenca] listaItem do jurado de id ${id} removido`)
    }

    /**
     * Alterna a lista de jurados exibida no componente.
     * @param {JuradoSorteado[]} newArray - O novo array de jurados a ser exibido.
     */
    alternateItems(newArray) {
        // Compara por referência. Se for o mesmo array, não faz nada.
        if (this.activeArray === newArray && this.element.children.length > 0) {
            console.log('[ListaPresenca] Tentativa de alternar para a mesma lista. Operação ignorada.');
            return;
        }

        console.log('[ListaPresenca] Alternando para uma nova lista de jurados.');

        // 1. Limpeza segura: Itera sobre os itens ativos e os remove um a um.
        // Isso garante que o método `remove()` de cada `ListaPresencaItem` seja chamado,
        // limpando event listeners e prevenindo memory leaks.
        this.activeListaItems.forEach((itemRegister) => {
            if (itemRegister.visible) {
                itemRegister.listaItem.remove();
                itemRegister.visible = false;
            }
        });
        // Limpa o Map após a remoção segura dos elementos.
        this.activeListaItems.clear();

        // 2. Define o novo array como ativo
        this.activeArray = newArray;

        // 3. Renderiza os itens do novo array
        this.activeArray.forEach(juradoSorteado => {
            this.renderListaItem({ juradoSorteado, onSelect: this.onSelect });
        });
    }

    /**
     * Define a lista ativa com base no tipo fornecido (para sincronização com o appState).
     * @param {string} listType - O tipo da lista a ser ativada (ListaTipo.PRINCIPAL ou ListaTipo.SECUNDARIA).
     */
    setActiveListByType(listType) {
        if (listType === ListaTipo.PRINCIPAL) {
            this.alternateItems(this.juradosTitulares);
        } else if (listType === ListaTipo.SECUNDARIA) {
            this.alternateItems(this.juradosSuplentes);
        }
    }
}
