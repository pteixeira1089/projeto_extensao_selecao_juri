//Renderer functions of the components of the ConselhoSorteio page

import { PageComposer } from "./PageComposer.js"
import { CardJurado } from "../view/ComposicaoUrna/CardJurado.js"
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import { JuradoStatus } from "../model/JuradoStatus.js"
import { UrnaItem } from "../view/ComposicaoUrna/UrnaItem.js"
import { ListaPresencaItem } from "../view/ComposicaoUrna/ListaPresencaItem.js";
import { ListaPresenca } from "../view/ComposicaoUrna/ListaPresenca.js";
import { ListaPresencaActions } from "../view/ComposicaoUrna/ListaPresencaActions.js";
import { appState } from "../appState.js";

/**
 * @typedef {import('../model/JuradoSorteado.js').JuradoSorteado} JuradoSorteado - cria um tipo para ser usado nas anotações deste arquivo
 */

/**
 * @typedef { Object } ListaItemRegister
 * @property { ListaPresencaItem } listaItem - instância do componente ListaPresencaItem
 * @property { boolean } visible - Controla se o item está visível no DOM
 */

/**
 * Mantém o registro das instâncias ativas de componentes UrnaItem
 * @type{ Map<string | number, UrnaItem }
 */
const activeUrnaItems = new Map();

/**
 * Mantém o registro das instâncias ativas de ListaPresencaItem
 * @type{ Map<string | number, ListaItemRegister}
 */
const activeListaItems = new Map();

/**
 * Mantém o registro da instância ativa de CardJurado
 * @type { CardJurado | null}
 */
let activeCardJurado = null;

/**
 * 
 * @param {Object} propsCardRender - props for rendering a JuradoCard element in a given target
 * @param {juradoSorteado} propsCardRender.juradoSorteado - juradoSorteado object that contains the data of the jurado
 * @param {string} propsCardRender.target - id of the HTML Element where the juradoCard will be rendered
 */
export function renderJuradoCard({ juradoSorteado, handlers, target }) {
    const container = document.getElementById(target);

    // Verificação de segurança: se o container não existir, não faça nada.
    if (!container) {
        console.error(`Renderer Error: Target element with ID "${target}" not found.`);
        return;
    }

    //Se já existe um card ativo, ele se autodestrói, primeiro
    if (activeCardJurado) {
        activeCardJurado.destroy();
    }

    //Cria uma nova instância do card
    const propsCard = {
        juradoSorteado: juradoSorteado,
        handlers: handlers
    };
    const newCard = new CardJurado(propsCard);
    const newCardElement = newCard.create();

    //Renderiza o componente no container
    container.replaceChildren(newCardElement)


    //Deubugging messages
    console.log('Card Jurado Renderer function was used:')
    console.log('Card Jurado rendered at HTML element with id: ', target)

    //Registra o objeto do Card no controle de componentes do renderer
    activeCardJurado = newCard;
}

/**
 * 
 * @param { object } props - props for rendering a Lista de Presença
 * @param { JuradoSorteado[] } props.juradosTitulares - array de jurados titulares
 * @param { JuradoSorteado[] } props.juradosSuplentes - array de jurados suplentes
 * @param { HTMLElement } props.target - html element where the list is gonna be rendered
 */
export function renderInitialLista({ juradosTitulares, juradosSuplentes, target, onSelect }) {
    //Debugging
    console.log('Render initialLista em execução')

    if (!juradosTitulares) {
        //Debugging
        console.log('A lista de presenças precisa de pelo menos um array de jurados titulares para ser criada. Operação abortada')
        return;
    }

    const listaPresenca = new ListaPresenca({
        juradosTitulares: juradosTitulares,
        juradosSuplentes: juradosSuplentes,
        onSelect: onSelect
    });

    const listaPresencaRenderer = new PageComposer(target);

    listaPresencaRenderer.addComponent(listaPresenca);

    //Registra a lista de presença
    appState.listObject = listaPresenca;

    //Debugging
    console.log(`Lista de presença gerada no target de id ${target.id}!`);
}

/**
 * 
 * @param { object } props - props for rendering the Lista Action Buttons
 * @param { object  } props.handlers - object containing the required handlers for the view component of action buttons
 * @param { HTMLElement } props.target - html element where the action buttons are going to be rendered
 */
export function renderListaActionButtons({ handlers, target }) {
    //Debugging
    console.log('Renderer renderListaActionButtons em execução')

    const actionButtons = new ListaPresencaActions(handlers);
    const renderer = new PageComposer(target);

    try {
        //Debugging
        console.log('Tentando gerar os action buttons no target informado');

        renderer.addComponent(actionButtons);

        //Debugging
        console.log(`Action buttons da lista de presença gerada no target de id ${target.id}!`);
    } catch (error) {
        //Debugging
        console.log('Não foi possível gerar os action buttons. Erro apresentado:')

        console.log(error);
    }
}

/**
 * 
 * @param {object} props
 * @param {JuradoSorteado} props.juradoSorteado
 * @param {function} props.onSelect
 * @returns 
 */
export function renderUrnaItem({
    juradoSorteado: juradoSorteado,
    onSelect: onSelect
 }) {
    const urnaDiv = document.getElementById('urna-container');

    //Debugging messages
    console.log('Processando a renderização de urnaItem para o jurado abaixo:');
    console.log(juradoSorteado);

    if (!urnaDiv) {
        console.log('Contêiner de urna não identificado - a página deve conter um elemento de urna');
        return;
    }

    //Verifica se o status do jurado é um valor aceito para compor a urna
    if (!(juradoSorteado.status === JuradoStatus.APTO)) {
        //Debugging messages
        console.log(`Status do jurado processado: ${juradoSorteado.status}`);
        console.log('O status do jurado sorteado é diferente de "presente" - cédula não é depositada na urna')
        return;
    }

    const urnaItemInstance = activeUrnaItems.get(juradoSorteado.id);
    //const urnaItem = document.getElementById(juradoSorteado.id) //abordagem não funciona se quisermos usar métodos da instância do objeto!

    if (!urnaItemInstance) {
        console.log('Não há um objeto urnaItem com este id - o renderer irá renderizar um novo elemento');
        const newUrnaItem = new UrnaItem({
            juradoSorteado: juradoSorteado, 
            onSelect: onSelect
        });
        const pageComposer = new PageComposer(urnaDiv);
        pageComposer.addComponent(newUrnaItem);

        //Registra o a nova instância no MAP - importante!
        activeUrnaItems.set(juradoSorteado.id, newUrnaItem);
    } else {
        console.log('UrnaItem já renderizado - re-renderizando componente')
        urnaItemInstance.update(juradoSorteado);
    }
}

/**
 * 
 * @param {object} props - object containing juror object and fallback function to instantiate a urnaItem, if needed
 * @param {JuradoSorteado} props.juradoSorteado - juror object
 * @param {function} props.onSelect - fallback function used to instantiate a UrnaItem (if needed)
 */
export function updateUrnaItem({ juradoSorteado, onSelect }) {
    //Debugging messages
    console.log('Executando a função updateUrnaItem para o jurado abaixo:');
    console.log(juradoSorteado);

    const juradoId = juradoSorteado.id;

    //Se já houver uma instância ativa de urnaItem para o id do juradoSorteado passado, primeiro temos que destruí-la
    if (activeUrnaItems.get(juradoId)) {
        //Debugging messages
        console.log(`Já há urnaItem ativa com o id ${juradoId}`);
        console.log(`Destruindo o urnaItem`);
        removeUrnaItem({ juradoId });
    }

    //Debugging messages
    console.log('Tenta criar uma nova instância de urnaItem para o jurado')
    renderUrnaItem({ juradoSorteado, onSelect }); //A verificação de condições para a criação já existe dentro da função responsável por criar/renderizar o componente
}

/**
 * Updates the urna counter text based on the application state.
 * This function should be subscribed to a state change event.
 * @param {number} newCount - The new count of items in the urna.
 */
export function updateUrnaCounter(newCount) {
    if (appState.urnaObject) {
        appState.urnaObject.updateCounter(newCount);
    }
}

export function removeUrnaItem({ juradoId }) {
    //1. Procura a instância do componente no nosso registro
    const urnaItemInstance = activeUrnaItems.get(juradoId);

    //2. Verifica se a instância existe
    if (!urnaItemInstance) {
        console.warn(`Tentativa de remover um urnaItem de jurado inexistente: id: ${juradoId}`);
        return
    }

    //3. Manda o próprio componente se destruir (limpar eventos e remover do DOM - usa o método do objeto (!)
    urnaItemInstance.remove();

    //4. Remove a referência do registro - passo importantíssimo e final
    activeUrnaItems.delete(juradoId);

    console.log(`urnaItem de jurado com ID ${juradoId} foi ocultado do DOM`);
}

/**
 * 
 * @param {object} props
 * @param {juradoSorteado[]} props.juradoSorteadoArray - array of JuradoSorteado
 * @param {function} props.onSelect - callback function to be attributed to the urnaItem
 */
export function loadInitialUrnaItems({juradoSorteadoArray, onSelect}) {
    //Debugging messages
    console.log('juradoSorteadoArray object bellow:');
    console.log(juradoSorteadoArray);

    if (juradoSorteadoArray) {
        juradoSorteadoArray
            .filter(jurado => jurado.status === JuradoStatus.APTO)
            .forEach(juradoApto => {
                //Debugging message
                console.log('Iterando o Jurado sorteado abaixo:');
                console.log(juradoApto);
                renderUrnaItem({ juradoSorteado: juradoApto, onSelect: onSelect });
            })
    }
}

export function destroyAllUrnaItems() {
    // Verifica se há itens para destruir
    if (activeUrnaItems.size === 0) {
        console.log("Nenhum item ativo para destruir.");
        return;
    }

    console.log(`Iniciando a destruição de ${activeUrnaItems.size} itens...`);

    activeUrnaItems.forEach((instance, juradoId) => {
        // 1. Manda a instância se destruir (remove do DOM, etc.)
        instance.remove();

        // 2. Remove diretamente do Map usando o ID que já temos.
        //    Não precisamos chamar a outra função, pois já temos tudo aqui.
        activeUrnaItems.delete(juradoId);
    });

    console.log("Todos os itens foram destruídos. O registro está vazio.");
    // Neste ponto, activeUrnaItems.size será 0.
    // Uma alternativa final seria chamar activeUrnaItems.clear(); após o loop para garantir.
}

/**
 * 
 * @param { object } props - props containing a JuradoSorteado object and a target where it's gonna be rendered (as a child)
 * @param { JuradoSorteado } props.juradoSorteado - JuradoSorteado object
 * @param { HTMLElement } props.target - HTMLElement under which the new listaItem will be rendered
 * @param { function } props.onSelect - callback function for the click event
 */
export function renderListaItem({ juradoSorteado, target, onSelect }) {
    //Debugging messages
    console.log('Executando renderer renderListaItem para o jurado abaixo:');
    console.log(juradoSorteado);

    if ((!target)) {
        //Debugging messages
        console.log(`Não foi informado um HTMLElement onde o listaItem deve ser renderizado. Operação não realizada`);
        return;
    }

    //Necessário verificar se o elemento já foi gerado
    const listaItemRegCheck = activeListaItems.get(juradoSorteado.id);

    if (listaItemRegCheck && listaItemRegCheck.visible) {
        //Debugging messages
        console.log(`Já existe um listaItem para este jurado - operação cancelada.`);
        return;
    }

    //Cria e registra um novo listaItem
    const newListaItem = new ListaPresencaItem({
        jurado: juradoSorteado, 
        onSelect: onSelect
    });
    const pageComposer = new PageComposer(target);

    pageComposer.addComponent(newListaItem);

    const listaItemReg = {
        listaItem: newListaItem,
        visible: true
    }

    activeListaItems.set(juradoSorteado.id, listaItemReg); //IMPORTANTE: registra o objeto
}

/**
 * 
 * @param {{juradoSorteado: JuradoSorteado}} juradoSorteado - jurado that is passed to render a listaItem 
 */
export function updateListaItem({ juradoSorteado }) {
    //Debugging messages
    console.log('Executando renderer updateListaItem para o jurado abaixo:')
    console.log(juradoSorteado)

    const listaItemInstance = activeListaItems.get(juradoSorteado.id).listaItem;

    if (!listaItemInstance) {
        //Debugging messages
        console.log(`Não foi encontrado um elemento para o jurado de id ${juradoSorteado.id}. Operação cancelada`);
        return;
    }

    listaItemInstance.update(juradoSorteado);
}

export function removeListaItem({ id }) {
    //Debugging messages
    console.log(`Iniciando remoção de listaItem para o jurado de id ${id}`)

    //1. Procura pela instância do objeto listaItem correspondente
    const listaItemReg = activeListaItems.get(id);

    if (!listaItemReg) {
        //Debugging message
        console.log(`Não há listaItem instanciado para o jurado de id ${id}. Operação não realizada.`)
        return;
    }

    listaItemReg.listaItem.remove();
    listaItemReg.visible = false;

    //Debugging message
    console.log(`listaItem do jurado de id ${id} removido`)

}

/**
 * 
 * @param {object} props - props containing a property corresponding to a JuradoSorteado type
 * @param {JuradoSorteado} props.juradoSorteado - jurado sorteado where the screen lists has to scroll to
 */
export function scrollComponents({ juradoSorteado }) {
    const listaItemObject = activeListaItems.get(juradoSorteado.id).listaItem;

    if (listaItemObject) {
        const listaItemHtmlElement = listaItemObject.element;
        listaItemHtmlElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}