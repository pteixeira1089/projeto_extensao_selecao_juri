import { FormaConvocacaoSuplentes } from "../../model/FormaConvocacaoSuplentes.js";

export class FormularioFormaConvocacaoSuplentes {

    /**
     * Function to be assigned to the button 'Na ordem de convocação'
     * @type { function }
     */
    onOrdemDeConvocacao;

    /**
     * Function to be assigned to the button 'Via sorteio'
     * @type { function }
     */
    onSorteio;

    /**
     * String that holds the formaDeConvocacao
     * @type { string | null }
     */
    formaConvocacao

    /**
     * Holds the html element
     * @type { HTMLElement }
     */
    element

    constructor({
        onOrdemDeConvocacao = () => alert('Ação padrão: botão "Na Ordem de Convocação" foi clicado.'), 
        onSorteio = () => alert('Ação padrão: botão "Via Sorteio" foi clicado.')
    } = {}) {
        
        this.onOrdemDeConvocacao = onOrdemDeConvocacao;
        this.onSorteio = onSorteio;        
        this.formaConvocacao = null;
        this.element = null;
    }

    create() {
        // Container principal que centraliza tudo
        const container = document.createElement('div');
        container.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'h-100', 'text-center');

        //QUANTIDADE DE RÉUS
        // Título
        const titleQttReus = document.createElement('h4');
        titleQttReus.innerText = 'QUANTIDADE DE RÉUS';
        titleQttReus.classList.add('mb-3');

        // Parágrafo de instrução
        const paragraphQttReus = document.createElement('p');
        paragraphQttReus.innerText = 'Indique abaixo a quantidade de réus. Este valor determina a quantidade de recusas imotivadas a que tem direito a(s) defesa(s) do(s) réu(s)';
        paragraphQttReus.style.fontSize = '16px';
        paragraphQttReus.classList.add('mb-4');

        // Container para o input de quantidade de réus (lado a lado)
        const qtdReusInputContainer = document.createElement('div');
        qtdReusInputContainer.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-5');

        //Container para os elementos da quantidade de réus (blocos d-flex flex-column)
        const qtdReusContainer = document.createElement('div');
        qtdReusContainer.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'mb-5');

        //Input
        const inputQuantidadeReus = document.createElement("input");
        inputQuantidadeReus.classList.add("form-control", "col-3");
        inputQuantidadeReus.type = "number";
        inputQuantidadeReus.value = "1"
        inputQuantidadeReus.id = "qtt-reus";
        inputQuantidadeReus.name = "qtt-reus";
        inputQuantidadeReus.min = "1";

        const quantidadeReusLabel = document.createElement("label");
        quantidadeReusLabel.htmlFor = "qtt-reus";
        quantidadeReusLabel.classList.add('form-check-label', 'mr-2', 'col-6');
        quantidadeReusLabel.innerText = 'Quantidade de réus: '

        qtdReusInputContainer.append(quantidadeReusLabel, inputQuantidadeReus);

        qtdReusContainer.append(titleQttReus, paragraphQttReus, qtdReusInputContainer);
        
        //FORMA DE CONVOCAÇÃO DE SUPLENTES
        // Título
        const title = document.createElement('h4');
        title.innerText = 'FORMA DE CONVOCAÇÃO DE SUPLENTES';
        title.classList.add('mb-3');

        // Parágrafo de instrução
        const paragraph = document.createElement('p');
        paragraph.innerText = 'Indique abaixo a forma como os suplentes serão convocados, caso haja necessidade.';
        paragraph.style.fontSize = '16px';
        paragraph.classList.add('mb-4');

        // Container para os botões e explicações (lado a lado)
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('d-flex', 'justify-content-center', 'align-items-start', 'gap-5');

        // --- Opção 1: Na Ordem ---
        const ordemDiv = document.createElement('div');
        ordemDiv.classList.add('d-flex', 'flex-column', 'align-items-center', 'mx-5');

        const btnOrdem = document.createElement('button');
        btnOrdem.classList.add('btn', 'btn-primary');
        btnOrdem.textContent = 'Na Ordem de Convocação';
        btnOrdem.addEventListener('click', this.onOrdemDeConvocacao);

        const explicacaoOrdem = document.createElement('p');
        explicacaoOrdem.classList.add('item-description', 'mt-2');
        explicacaoOrdem.style.maxWidth = '300px';
        explicacaoOrdem.textContent = 'Convoca os suplentes seguindo a ordem em que aparecem na lista de suplência, gerada no sorteio inicial de jurados.';

        ordemDiv.append(btnOrdem, explicacaoOrdem);

        // --- Opção 2: Sorteio ---
        const sorteioDiv = document.createElement('div');
        sorteioDiv.classList.add('d-flex', 'flex-column', 'align-items-center', 'mx-5');

        const btnSorteio = document.createElement('button');
        btnSorteio.classList.add('btn', 'btn-secondary');
        btnSorteio.textContent = 'Via Sorteio';
        btnSorteio.addEventListener('click', this.onSorteio);

        const explicacaoSorteio = document.createElement('p');
        explicacaoSorteio.classList.add('item-description', 'mt-2');
        explicacaoSorteio.style.maxWidth = '300px';
        explicacaoSorteio.textContent = 'Quando houver necessidade de um suplente, um novo sorteio será realizado apenas com os nomes dos suplentes disponíveis.';

        sorteioDiv.append(btnSorteio, explicacaoSorteio);

        // Montagem final
        optionsContainer.append(ordemDiv, sorteioDiv);
        container.append(qtdReusContainer, title, paragraph, optionsContainer);

        this.element = container;
        return this.element;
    }
}