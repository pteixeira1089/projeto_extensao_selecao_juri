//Renderer functions of the components of the ConselhoSorteio page

import { PageComposer } from "./PageComposer.js"
import { CardJurado } from "../view/ConselhoSorteio/CardJurado.js"
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import { UrnaItem } from "../view/ConselhoSorteio/UrnaItem.js"
import { ListaPresencaItem } from "../view/ConselhoSorteio/ListaPresencaItem.js";

/**
 * @typedef {import('../model/JuradoSorteado.js').JuradoSorteado} JuradoSorteado - cria um tipo para ser usado nas anotações deste arquivo
 */

//Registro de componentes/objetos ativos - MOVER PARA O APPSTATE

/**
 * Mantém o registro das instâncias ativas de componentes UrnaItem
 * @type{ Map<string | number, UrnaItem }
 */
const activeUrnaItems = new Map();

/**
 * Mantém o registro das instâncias ativas de ListaPresencaItem
 * @type{ Map<string | number, ListaPresencaItem}
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

export function renderUrnaItem({ juradoSorteado }) {
    const urnaDiv = document.getElementById('urna-container');

    //Debugging messages
    console.log('Processando a renderização de urnaItem para o jurado abaixo:');
    console.log(juradoSorteado);

    if (!urnaDiv) {
        console.log('Contêiner de urna não identificado - a página deve conter um elemento de urna');
        return;
    }

    //Verifica se o status do jurado é um valor aceito para compor a urna
    if (!(juradoSorteado.status === 'presente - apto para sorteio')) {
        //Debugging messages
        console.log(`Status do jurado processado: ${juradoSorteado.status}`);
        console.log('O status do jurado sorteado é diferente de "presente" - cédula não é depositada na urna')
        return;
    }

    const urnaItemInstance = activeUrnaItems.get(juradoSorteado.id);
    //const urnaItem = document.getElementById(juradoSorteado.id) //abordagem não funciona se quisermos usar métodos da instância do objeto!

    if (!urnaItemInstance) {
        console.log('Não há um objeto urnaItem com este id - o renderer irá renderizar um novo elemento');
        const newUrnaItem = new UrnaItem(juradoSorteado);
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
 * @param {{juradoSorteado: JuradoSorteado}} juradoSorteado - juradoSorteado passed to the function with the data to be updated 
 */
export function updateUrnaItem({ juradoSorteado }) {
    //Debugging messages
    console.log('Executando a função updateUrnaItem para o jurado abaixo:');
    console.log(juradoSorteado);

    const juradoId = juradoSorteado.id;

    //Se já houver uma instância ativa de urnaItem para o id do juradoSorteado passado, primeiro temos que destruí-la
    if (activeUrnaItems.get(juradoId)) {
        //Debugging messages
        console.log(`Já há urnaItem ativa com o id ${juradoId}`);
        console.log(`Destruindo o urnaItem`);
        destroyUrnaItem({ juradoId });
    }

    //Debugging messages
    console.log('Tenta criar uma nova instância de urnaItem para o jurado')
    renderUrnaItem({ juradoSorteado }); //A verificação de condições para a criação já existe dentro da função responsável por criar/renderizar o componente
}

export function destroyUrnaItem({ juradoId }) {
    //1. Procura a instância do componente no nosso registro
    const urnaItemInstance = activeUrnaItems.get(juradoId);

    //2. Verifica se a instância existe
    if (!urnaItemInstance) {
        console.warn(`Tentativa de destruir um componente de jurado inexistente: id: ${juradoId}`);
        return
    }

    //3. Manda o próprio componente se destruir (limpar eventos e remover do DOM - usa o método do objeto (!)
    urnaItemInstance.destroy();

    //4. Remove a referência do registro - passo importantíssimo e final
    activeUrnaItems.delete(juradoId);

    console.log(`Componente com ID ${juradoId} foi destruído e removido do registro de componentes ativos`);
}

/**
 * 
 * @param {JuradoSorteado[]} juradoSorteadoArray - array of JuradoSorteado
 */
export function loadInitialUrnaItems(juradoSorteadoArray) {
    //Debugging messages
    console.log('juradoSorteadoArray object bellow:');
    console.log(juradoSorteadoArray);

    if (juradoSorteadoArray) {
        juradoSorteadoArray
            .filter(jurado => jurado.status === 'presente - apto para sorteio')
            .forEach(juradoApto => {
                //Debugging message
                console.log('Iterando o Jurado sorteado abaixo:');
                console.log(juradoApto);
                renderUrnaItem({ juradoSorteado: juradoApto });
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
        instance.destroy();

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
 */
export function renderListaItem({ juradoSorteado, target }) {
    //Debugging messages
    console.log('Executando renderer renderListaItem para o jurado abaixo:');
    console.log(juradoSorteado);

    if ((!target)) {
        //Debugging messages
        console.log(`Não foi informado um HTMLElement onde o listaItem deve ser renderizado. Operação não realizada`);
        return;
    }

    //Necessário verificar se o elemento já foi gerado
    const listaItemInstance = activeListaItems.get(juradoSorteado.id);

    if (listaItemInstance) {
        //Debugging messages
        console.log(`Já existe um listaItem para este jurado - operação cancelada.`);
        return;
    }

    //Cria e registra um novo listaItem
    const newListaItem = new ListaPresencaItem(juradoSorteado);
    const pageComposer = new PageComposer(target);

    pageComposer.addComponent(newListaItem);

    activeListaItems.set(juradoSorteado.id, newListaItem); //IMPORTANTE: registra o objeto
}

/**
 * 
 * @param {{juradoSorteado: JuradoSorteado}} juradoSorteado - jurado that is passed to render a listaItem 
 */
export function updateListaItem({ juradoSorteado }) {
    //Debugging messages
    console.log('Executando renderer updateListaItem para o jurado abaixo:')
    console.log(juradoSorteado)

    const listaItemInstance = activeListaItems.get(juradoSorteado.id);

    if (!listaItemInstance) {
        //Debugging messages
        console.log(`Não foi encontrado um elemento para o jurado de id ${idJurado}. Operação cancelada`);
        return;
    }

    listaItemInstance.update(juradoSorteado);
}


/**
 * 
 * @param {object} props - props containing a property corresponding to a JuradoSorteado type
 * @param {JuradoSorteado} props.juradoSorteado - jurado sorteado where the screen lists has to scroll to
 */
export function scrollComponents({ juradoSorteado }) {
    const listaItemObject = activeListaItems.get(juradoSorteado.id);

    if (listaItemObject) {
        const listaItemHtmlElement = listaItemObject.element;
        listaItemHtmlElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}