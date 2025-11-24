import { appState } from "../../appState.js";
import { FormaConvocacaoSuplentes } from "../../model/enums/FormaConvocacaoSuplentes.js";
import { OptionSelector } from "../Shared/OptionSelector.js";

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

    /**
     * Function to be assigned to the confirm button
     * @type { function }
     */
    onConfirm;

    constructor({
        onOrdemDeConvocacao = () => alert('Ação padrão: botão "Na Ordem de Convocação" foi clicado.'),
        onSorteio = () => alert('Ação padrão: botão "Via Sorteio" foi clicado.'),
        onConfirm = () => alert('Ação padrão: botão "Confirmar" foi clicado.')
    } = {}) {

        this.onOrdemDeConvocacao = onOrdemDeConvocacao;
        this.onSorteio = onSorteio;
        this.onConfirm = onConfirm;
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
        title.classList.add('mb-3', 'mt-5');

        // Parágrafo de instrução
        const paragraph = document.createElement('p');
        paragraph.innerText = 'Indique abaixo a forma como os suplentes serão convocados, caso haja necessidade.';
        paragraph.style.fontSize = '16px';
        paragraph.classList.add('mb-4');

        const optionSelector = new OptionSelector();

        const propsOptions = {
            'Em ordem': [
                'Convoca os suplentes na ordem em que constam listados no sistema (definida quando do sorteio que definiu os jurados suplentes)',
                this.onOrdemDeConvocacao
            ],
            'Sorteio': [
                'Convoca um suplente por meio de sorteio, dentre os suplentes disponíveis para a convocação',
                this.onSorteio
            ]
        }

        const optionSorteio = optionSelector.buildSimpleOptionList(propsOptions);
        optionSorteio.classList.add('mb-5');

        //BOTÃO DE CONFIRMAÇÃO
        const confirmButton = document.createElement('button');
        confirmButton.classList.add('btn', 'btn-primary', 'mt-5');
        confirmButton.innerText = 'Confirmar dados'
        // Associa o evento de clique ao handler onConfirm recebido no construtor
        confirmButton.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmProps = {
                numeroReus: inputQuantidadeReus.value,
                FormaConvocacaoSuplentes: appState.formaConvocacaoSuplentes
            }

            this.onConfirm(confirmProps);
            return;
        });

        // Montagem final
        container.append(qtdReusContainer, title, paragraph, optionSorteio, confirmButton);

        this.element = container;
        return this.element;
    }
}