import { JuradoSorteado } from "../../model/JuradoSorteado.js";

export class UrnaItem {

    /** 
     * @type {JuradoSorteado}
     */
    juradoSorteado;
    
    /**
     * @type {function}
     */
    onSelect;

    /**
     * @type {HTMLElement}
     */
    element;

    /**
     * 
     * @param {object} props - object parameter containing a juror Object and a callback function for the click event
     * @param {JuradoSorteado} propos.juradoSorteado - juror object
     * @param {function} props.onSelect - callback function to be associated with the click event of UrnaItem instance
     */
    constructor({ juradoSorteado, onSelect }) {
        this.juradoSorteado = juradoSorteado;
        this.onSelect = onSelect

        this.element = null; //Guarda a referência ao próprio elemento, no DOM - útil para update
    }

    create() {
        const anchor = document.createElement('a');
        anchor.id = this.id; //Use this when building a renderer at component level
        anchor.classList.add('list-group-item', 'list-group-item-action');

        const containerName = document.createElement('div');
        containerName.classList.add('d-flex', 'w-80', 'justify-content-center');

        const nameItem = document.createElement('h5');
        nameItem.classList.add('mb-1', 'jurado-nome');
        nameItem.innerText = this.juradoSorteado.nome;

        const statusItem = document.createElement('small');
        statusItem.classList.add('jurado-status');
        statusItem.innerText = `(${this.juradoSorteado.status})`;

        const profissaoItem = document.createElement('p');
        profissaoItem.classList.add('jurado-profissao');
        profissaoItem.innerText = this.juradoSorteado.profissao;

        const cpfItem = document.createElement('p');
        cpfItem.classList.add('jurado-cpf');
        cpfItem.innerText = this.juradoSorteado.cpf;


        containerName.appendChild(nameItem);

        anchor.appendChild(containerName);
        anchor.appendChild(profissaoItem);
        anchor.appendChild(cpfItem);
        anchor.appendChild(statusItem);

        anchor.addEventListener('click', (event) => {
            event.preventDefault();

            this.onSelect(this.juradoSorteado);
        })

        this.element = anchor

        return this.element;
    }

    /**
     * 
     * @param {JuradoSorteado} juradoSorteado - juror object containing info for updating the UrnaItem instance
     */
    update(juradoSorteado) {
        if (juradoSorteado.id) {
            this.juradoSorteado = juradoSorteado;
        }

        const nomeElement = this.element.querySelector('.jurado-nome');
        const profissaoElement = this.element.querySelector('.jurado-profissao');
        const cpfElement = this.element.querySelector('.jurado-cpf');
        const statusElement = this.element.querySelector('.jurado-status');

        if (juradoSorteado.nome && nomeElement) {
            nomeElement.textContent = this.juradoSorteado.nome;
        }

        if (juradoSorteado.profissao && profissaoElement) {
            profissaoElement.textContent = this.profissao;
        }

        if (juradoSorteado.cpf && cpfElement) {
            cpfElement.textContent = this.juradoSorteado.cpf;
        }

        if (juradoSorteado.status !== undefined && statusElement) {
            statusElement.textContent = `(${this.juradoSorteado.status})`;
        }
    }

    remove() {
        console.log(`Removendo o componente para o jurado ${this.nome}`)

        //1. Limpe event listeners para evitar memory leaks (se houver)
        // const button = this.element.querySelector('.meu-botao');
        // button.removeEventListener('click', this.handleButtonClick);

        //2. Remove o elemento do DOM
        this.element.remove();

        //3. (Opcional) Limpa a referência ao elemento no próprio objeto
        //this.element = null;
    }
}