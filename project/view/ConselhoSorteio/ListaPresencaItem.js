export class ListaPresencaItem {
    constructor({ id, nome, profissao, cpf, status }) {
        this.id = id;
        this.nome = nome;
        this.profissao = profissao;
        this.cpf = cpf;
        this.status = status;

        this.element = null;
    }

    create() {
        const anchor = document.createElement('a');
        anchor.dataset.juradoId = this.id;
        anchor.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'gap-3', 'py-3');

        const dataDiv = document.createElement('div');
        dataDiv.classList.add('d-flex', 'gap-2', 'w-100', 'justify-content-between');

        const dataBlock = document.createElement('div');
        dataBlock.classList.add('text-center', 'w-100'); // Centraliza o texto
        const juradoNome = document.createElement('h6');
        juradoNome.classList.add('jurado-nome');
        const juradoProfissao = document.createElement('p');
        juradoProfissao.classList.add('jurado-profissao');
        const juradoCPF = document.createElement('p');
        juradoCPF.classList.add('jurado-cpf');
        const juradoStatus = document.createElement('small');
        juradoStatus.classList.add('jurado-status');

        juradoNome.textContent = this.nome;
        juradoProfissao.textContent = this.profissao;
        juradoCPF.textContent = `CPF: ${this.cpf}`;
        juradoStatus.textContent = this.status;

        dataBlock.append(juradoNome, juradoProfissao, juradoCPF);

        dataDiv.append(dataBlock, juradoStatus);

        anchor.append(dataDiv);

        this.element = anchor;

        return anchor;
    }

    update({id, nome, profissao, cpf, status}){
        // Verificação de segurança: este componente só pode ser atualizado com dados do mesmo jurado.
        if (id !== this.id) {
            console.log('Solicitada atualização de id diferente do id do jurado instanciado neste objeto - operação não permitida.')
            return;
        }

        // Seleciona os elementos uma única vez
        const nomeElement = this.element.querySelector('.jurado-nome');
        const profissaoElement = this.element.querySelector('.jurado-profissao');
        const cpfElement = this.element.querySelector('.jurado-cpf');
        const statusElement = this.element.querySelector('.jurado-status');

        // Atualiza cada campo se um novo valor for fornecido e o elemento existir
        if (nome && nomeElement) {
            this.nome = nome;
            nomeElement.textContent = this.nome;
        }

        if (profissao && profissaoElement) {
            this.profissao = profissao;
            profissaoElement.textContent = this.profissao;
        }

        if (status !== undefined && statusElement) {
            this.status = status;
            statusElement.textContent = this.status;
        }

        if (cpf && cpfElement) {
            this.cpf = cpf;
            cpfElement.textContent = this.cpf;
        }
    }

    destroy() {
        //Debugging messages
        console.log(`Destruindo o componente para o jurado ${this.nome}.`);

        //1. Limpe event listeners para evitar memory leaks
        //this.element.removeEventListener('click', this.handleAnchorClick);

        //2. Remove o elemento do DOM
        this.element.remove();

        //3 (Opcional) Limpa a referência ao elemento no próprio objeto
        this.element = null;
    }
}