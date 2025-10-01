//Renderer functions of the components of the ConselhoSorteio page

import { PageComposer } from "./PageComposer.js"
import { CardJurado } from "../view/ConselhoSorteio/CardJurado.js"
import { juradoSorteado } from "../model/JuradoSorteado.js"

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
