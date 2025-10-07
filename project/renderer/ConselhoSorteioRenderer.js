//Renderer functions of the components of the ConselhoSorteio page

import { PageComposer } from "./PageComposer.js"
import { CardJurado } from "../view/ConselhoSorteio/CardJurado.js"
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import { UrnaItem } from "../view/ConselhoSorteio/UrnaItem.js"

const activeUrnaItems = new Map();

/**
 * 
 * @param {Object} propsCardRender - props for rendering a JuradoCard element in a given target
 * @param {juradoSorteado} propsCardRender.juradoSorteado - juradoSorteado object that contains the data of the jurado
 * @param {string} propsCardRender.target - id of the HTML Element where the juradoCard will be rendered
 */
export function renderJuradoCard({ juradoSorteado, target }) {
    const container = document.getElementById(target);

    // Verificação de segurança: se o container não existir, não faça nada.
    if (!container) {
        console.error(`Renderer Error: Target element with ID "${target}" not found.`);
        return;
    }

    const pageComposer = new PageComposer(container);

    const propsCard = {
        juradoSorteado: juradoSorteado,
        handlers: {}
    };

    const card = new CardJurado(propsCard);

    // Limpa o container antes de adicionar o novo componente para evitar duplicatas.
    container.innerHTML = '';
    //Renderiza o componente
    pageComposer.addComponent(card);

    //Deubugging messages
    console.log('Card Jurado Renderer function was used:')
    console.log('Card Jurado rendered at HTML element with id: ', target)

    return;
}

export function renderUrnaItem({ juradoSorteado }) {
    const urnaDiv = document.getElementById('urna-container');

    if (!urnaDiv) {
        console.log('Contêiner de urna não identificado - a página deve conter um elemento de urna');
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
                renderUrnaItem({juradoSorteado: juradoApto});
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
