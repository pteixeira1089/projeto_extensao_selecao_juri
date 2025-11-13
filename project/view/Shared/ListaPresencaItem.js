import { JuradoConselho } from "../../model/JuradoConselho.js";
import { JuradoSorteado } from "../../model/JuradoSorteado.js";

export class ListaPresencaItem {
    
    /**
     * 
     * @param {object} props - object containing juror info and a callback function for handling click
     * @param {JuradoSorteado | JuradoConselho} props.jurado - object representing the juror
     * @param {function} props.onSelect - callback function to handle the click event
     */
    constructor({ jurado, onSelect = null}) {
        this.jurado = jurado;
        this.onSelect = onSelect;

        this.element = null;
    }

    create() {
        const anchor = document.createElement('a');
        anchor.dataset.juradoId = this.jurado.id;
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
        
        juradoNome.textContent = this.jurado.nome;
        juradoProfissao.textContent = this.jurado.profissao;
        juradoCPF.textContent = `CPF: ${this.jurado.cpf}`;
        juradoStatus.textContent = this.jurado.getDisplayStatus();

        dataBlock.append(juradoNome, juradoProfissao, juradoCPF);

        dataDiv.append(dataBlock, juradoStatus);

        anchor.append(dataDiv);

        dataDiv.addEventListener('click', 
            (event) => {
                event.preventDefault();
                this.onSelect(this.jurado);
            });

        this.element = anchor;

        return anchor;
    }

    /**
     * 
     * @param {JuradoSorteado | JuradoConselho} newJurado 
     */
    update(newJurado){
        // Verificação de segurança: este componente só pode ser atualizado com dados do mesmo jurado.
        if (newJurado.id !== this.jurado.id) {
            console.log('Solicitada atualização de id diferente do id do jurado instanciado neste objeto - operação não permitida.')
            return;
        }

        // Seleciona os elementos uma única vez
        const nomeElement = this.element.querySelector('.jurado-nome');
        const profissaoElement = this.element.querySelector('.jurado-profissao');
        const cpfElement = this.element.querySelector('.jurado-cpf');
        const statusElement = this.element.querySelector('.jurado-status');

        // Atualiza cada campo se um novo valor for fornecido e o elemento existir
        if (newJurado.nome && nomeElement) {
            this.jurado.nome = newJurado.nome;
            nomeElement.textContent = this.jurado.nome;
        }

        if (newJurado.profissao && profissaoElement) {
            this.jurado.profissao = newJurado.profissao;
            profissaoElement.textContent = this.jurado.profissao;
        }

        if (newJurado.getDisplayStatus() !== undefined && statusElement) {
            this.jurado.setDisplayStatus(newJurado.getDisplayStatus());
            statusElement.textContent = this.jurado.getDisplayStatus();
        }

        if (newJurado.cpf && cpfElement) {
            this.jurado.cpf = newJurado.cpf;
            cpfElement.textContent = `CPF: ${this.jurado.cpf}`;
        }
    }

    remove() {
        //Observação: Não é uma operação de destruição (não pode 'limpar' o this.element), pois as listas podem se alternar
        //Apenas remove do DOM, mas mantém a instância e a referência ao objeto
        
        
        //Debugging messages
        console.log(`Removendo o componente para o jurado ${this.nome}.`);

        //1. Limpe event listeners para evitar memory leaks
        this.element.removeEventListener('click', this.handleAnchorClick);

        //2. Remove o elemento do DOM
        this.element.remove();
    }
}