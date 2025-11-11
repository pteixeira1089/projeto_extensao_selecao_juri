import { JuradoStatus } from "../../model/JuradoStatus.js";
import { InfoJuradoActions } from "./InfoJuradoActions.js";

export class InfoJurado {
    /**
     * @param {Object} props - The props for the view rendering
     * @param {string} props.id - id do jurado
     * @param {string} props.nome - nome do jurado
     * @param {string} props.cpf - cpf do jurado
     * @param {string} props.profissao - profissão do jurado
     * @param {string} props.status - status do jurado
     * @param {function} [props.onClearStatus] - optional callback invoked when the clear button is clicked
     */
    constructor({ id, nome, profissao, cpf, status, onClearStatus = null}) {
        this.id = id;
        this.nome = nome;
        this.profissao = profissao;
        this.cpf = cpf;
        this.status = status;
        this.onClearStatus = onClearStatus;

        this.element = null; //Referência ao elemento gerado no DOM - é atualizado no método de criação / edição / destruição
    }

    create() {
        const container = document.createElement('div');
        // Adiciona classes para usar flexbox e distribuir o conteúdo
        container.classList.add(
            'd-flex',
            'flex-column',
            'justify-content-center',
            'h-100'
        );

        const nome = document.createElement('h3');
        nome.classList.add('text-center', 'mb-1', 'mt-2', 'card-nome');
        nome.textContent = this.nome;

        const profissao = document.createElement('h5');
        profissao.classList.add('text-center', 'mb-1', 'card-profissao');
        profissao.textContent = this.profissao;

        const cpf = document.createElement('p');
        cpf.classList.add('text-center', 'mb-2', 'card-cpf');
        cpf.innerHTML = `<b>CPF: </b>${this.cpf}`;
        
        const statusText = document.createElement('h6');
        statusText.classList.add('card-status'); // Removido 'text-center' e 'mb-3'
        statusText.innerHTML = this.status ? `${this.status}` : `<b>[status do jurado não foi indicado - escolha uma opção abaixo]</b>`

        const infoJuradoAction = new InfoJuradoActions({onClearStatus: this.onClearStatus});
        const clearButton = infoJuradoAction.create();

        // Novo container para o status e o botão
        const statusAndButtonContainer = document.createElement('div');
        statusAndButtonContainer.classList.add(
            'd-flex', 
            'flex-column', 
            'justify-content-center', 
            'align-items-center', 
            'gap-2', 
            'mb-3'
        );
        statusAndButtonContainer.appendChild(statusText);
        statusAndButtonContainer.appendChild(clearButton);

        container.appendChild(nome);
        container.appendChild(profissao);
        container.appendChild(cpf);
        container.appendChild(statusAndButtonContainer);

        this.element = container; //Vínculo entre o elemento do DOM e o objeto JS

        return container;
    }

    update({ id, nome, profissao, cpf, status }) {

        const nomeElement = this.element.querySelector('.card-nome');
        const profissaoElement = this.element.querySelector('.card-profissao');
        const cpfElement = this.element.querySelector('.card-cpf');
        const statusElement = this.element.querySelector('.card-staus');

        if (id) {
            this.id = id;
        }

        if (nome) {
            this.nome = nome;
            nomeElement.textContent = this.nome;
        }

        if (profissao) {
            this.profissao = profissao;
            profissaoElement.textContent = this.profissao;
        }

        if (cpf) {
            this.cpf = cpf;
            cpfElement.innerHTML = `<b>CPF: </b>${this.cpf}`;
        }

        if (status) {
            this.status = status;
            statusText.innerHTML = this.status ? `${this.status}` : `<b>[selecione abaixo um status para o intimado]</b>`
        }

    }

    destroy() {
        console.log(`Destruindo o componente InfoJurado`);

        //1. Limpe event listeners para evitar memory leaks (se houver)
        // const button = this.element.querySelector('.meu-botao');
        // button.removeEventListener('click', this.handleButtonClick);

        //2. Remove o elemento do DOM
        this.element.remove();

        //3. (Opcional) Limpa a referência ao elemento no próprio objeto
        this.element = null;
    }
}