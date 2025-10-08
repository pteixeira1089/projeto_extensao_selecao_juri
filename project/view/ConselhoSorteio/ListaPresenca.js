import { JuradoSorteado } from "../../model/JuradoSorteado.js";

/**
 * @typedef { import('../../model/JuradoSorteado.js').JuradoSorteado } JuradoSorteado - typedef to be used in this file
 */

export class ListaPresenca {
    /**
     * Creates a div element that holds a list of jurados.
     * @param { { jurados: JuradoSorteado[] } } jurados - an object containing a JuradoSorteado instance
     */
    constructor({jurados: jurados = [] }) { // É uma boa prática inicializar o array para evitar erros
        this.jurados = jurados;
    }

    create() {
        const container = document.createElement('div');
        container.classList.add('conselho-sorteio-lista', 'ml-3', 'mr-3', 'list-group', 'w-20');

        this.jurados.forEach(jurado => {
            const anchor = document.createElement('a');
            anchor.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'gap-3', 'py-3');
            
            const dataDiv = document.createElement('div');
            dataDiv.classList.add('d-flex', 'gap-2', 'w-100', 'justify-content-between');

            const dataBlock = document.createElement('div');
            const juradoNome = document.createElement('h6');
            const juradoProfissao = document.createElement('p');
            const juradoCPF = document.createElement('p');
            const juradoStatus = document.createElement('small');

            juradoNome.textContent = jurado.nome;
            juradoProfissao.textContent = jurado.profissao;
            juradoCPF.textContent = `CPF: ${jurado.cpf}`;
            juradoStatus.textContent = jurado.status;

            dataBlock.append(juradoNome, juradoProfissao, juradoCPF);

            dataDiv.append(dataBlock, juradoStatus);

            anchor.append(dataDiv);

            //Adds the anchor (acts as a li) in the [outside] div
            container.append(anchor);
        });

        return container;
    }
}