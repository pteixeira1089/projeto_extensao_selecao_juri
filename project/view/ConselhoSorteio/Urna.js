export class Urna {

    create(){
        // Wrapper that will contain the counter (texto alinhado à direita)
        // e a lista/contêiner da urna logo abaixo.
        const wrapper = document.createElement('div');
        wrapper.classList.add('urna-wrapper');

        // Contêiner do contador (texto alinhado à direita)
        const counterDiv = document.createElement('div');
        counterDiv.classList.add('urna-counter-container', 'mb-2');
        // Use utilitário de alinhamento à direita (Bootstrap: text-end) se disponível
        counterDiv.classList.add('text-end');

        const counterParagraph = document.createElement('p');
        counterParagraph.classList.add('urna-counter');
        counterParagraph.id = 'urna-count';
        // Texto inicial — o código que manipula a urna deverá atualizar este elemento
        counterParagraph.textContent = 'Cédulas na urna: 0';

        counterDiv.appendChild(counterParagraph);

        // Contêiner que já existia para armazenar os itens da urna (mantém classes e id)
        const urnaListContainer = document.createElement('div');
        urnaListContainer.classList.add('list-group', 'urna-container');
        urnaListContainer.id = 'urna-container';

        // Anexa o contador acima e a lista abaixo, como solicitado
        wrapper.appendChild(counterDiv);
        wrapper.appendChild(urnaListContainer);

        return wrapper;
    }
}