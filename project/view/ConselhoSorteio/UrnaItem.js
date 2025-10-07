export class UrnaItem {

    /**
     * 
     * @param {object} props - object item with  
     */
    constructor({id, nome, profissao, cpf, status}){
        this.id = id;
        this.nome = nome;
        this.profissao = profissao;
        this.cpf = cpf;
        this.status = status;

        this.element = null; //Guarda a referência ao próprio elemento, no DOM - útil para update
    }

    create(){
        const anchor = document.createElement('a');
        anchor.id = this.id; //Use this when building a renderer at component level
        anchor.classList.add('list-group-item', 'list-group-item-action');

        const containerName = document.createElement('div');
        containerName.classList.add('d-flex', 'w-100', 'justify-content-between');

        const nameItem = document.createElement('h5');
        nameItem.classList.add('mb-1', 'jurado-nome');
        nameItem.innerText = this.nome;

        const statusItem = document.createElement('small');
        statusItem.classList.add('jurado-status');
        statusItem.innerText = this.status;

        const profissaoItem = document.createElement('p');
        profissaoItem.classList.add('jurado-profissao');
        profissaoItem.innerText = this.profissao;

        const cpfItem = document.createElement('small');
        cpfItem.classList.add('jurado-cpf');
        cpfItem.innerText = this.cpf;


        containerName.appendChild(nameItem);
        containerName.appendChild(statusItem);

        anchor.appendChild(containerName);
        anchor.appendChild(profissaoItem);
        anchor.appendChild(cpfItem);

        this.element = anchor

        return this.element;
    }

    update({id, nome, profissao, cpf, status}){
        if (id) {
            this.id = id;
        }

        const nomeElement = this.element.querySelector('.jurado-nome');
        const profissaoElement = this.element.querySelector('.jurado-profissao');
        const cpfElement = this.element.querySelector('.jurado-cpf');
        const statusElement = this.element.querySelector('.jurado-status');

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
            cpfElement.textContent = this.cpf;
        }

        if (status) {
            this.status = status;
            statusElement.textContent = this.status;
        }
    }

    destroy(){
        console.log(`Destruindo o componente para o jurado ${this.nome}`)

        //1. Limpe event listeners para evitar memory leaks (se houver)
        // const button = this.element.querySelector('.meu-botao');
        // button.removeEventListener('click', this.handleButtonClick);

        //2. Remove o elemento do DOM
        this.element.remove();

        //3. (Opcional) Limpa a referência ao elemento no próprio objeto
        this.element = null;
    }
}