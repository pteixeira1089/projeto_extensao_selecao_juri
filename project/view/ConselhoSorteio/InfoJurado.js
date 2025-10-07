export class InfoJurado {
    /**
     * 
     * @param {Object} props - The props for the view rendering
     * @param {string} nome - nome do jurado
     * @param {string} cpf - cpf do jurado
     * @param {string} profissao - profissão do jurado
     * @param {string} status - status do jurado
     */
    constructor({nome, profissao, cpf, status}) {
        this.nome = nome;
        this.profissao = profissao;
        this.cpf = cpf;
        this.status = status;
    }

    create() {
        const container = document.createElement('div');
        //container.classList.add('conselho-sorteio-card');

        const nome = document.createElement('h3');
        nome.classList.add('text-center', 'mb-1', 'mt-2');
        nome.innerHTML = `${this.nome}`;

        const profissao = document.createElement('h5');
        profissao.classList.add('text-center', 'mb-1');
        profissao.innerHTML = `${this.profissao}`;

        const cpf = document.createElement('p');
        cpf.classList.add('text-center', 'mb-2');
        cpf.innerHTML = `<b>CPF: </b>${this.cpf}`;

        const statusText = document.createElement('h6');
        statusText.classList.add('text-center', 'mb-3');
        statusText.innerHTML = this.status ? `${this.status}` : `<b> [selecione abaixo um status para o intimado]`


        container.appendChild(nome);
        container.appendChild(profissao);
        container.appendChild(cpf);
        container.appendChild(statusText);

        return container;

    }
}