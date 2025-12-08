import { appState, AppState } from "../appState.js";

export class FinalReport {

    /**
     * Function to be assigned to the button 'Imprimir Relatório'
     * @type { function }
     */
    onImprimirRelatorio;

    /**
     * Function to be assigned to the button 'FinalizarAplicacao'
     * @type { function }
     */
    onExportAndFinish;

    /**
     * appState component that holds the components of the application
     * @type { AppState }
     */
    instanceAppState;

    /**
     * Holds the html element
     * @type { HTMLElement }
     */
    element

    /**
     * @param {object} [props={}] - Objeto de propriedades para inicializar o componente.
     * @param {function} [props.onImprimirRelatorio] - Callback para o botão "Imprimir Relatório".
     * @param {function} [props.onExportAndFinish] - Callback para o botão "Finalizar Aplicação".
     * @param {AppState} [props.instanceAppState=appState] - A instância do estado da aplicação.
     */
    constructor({
        onImprimirRelatorio = () => alert('[FinalReport component]: botão "Imprimir Relatório" foi clicado. INJETE DEPENDÊNCIAS!'),
        onExportAndFinish = () => alert('[FinalReport component] botão "Finalizar Aplicação" foi clicado. INJETE DEPENDÊNCIAS!'),
        instanceAppState = appState //atribui a variável exportada de appState, por padrão (singleton)
    } = {}) {

        this.onImprimirRelatorio = onImprimirRelatorio;
        this.onExportAndFinish = onExportAndFinish;
        
        this.instanceAppState = instanceAppState; // Agora o editor deve reconhecer o tipo
    }

    create() {
        // Container principal que centraliza tudo
        const container = document.createElement('div');
        container.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'h-100', 'text-center');

        // Título
        const reportTitle = document.createElement('h4');
        reportTitle.innerText = 'SORTEIO ELETRÔNICO DO JÚRI';
        reportTitle.classList.add('mb-3');
 
        //Juri name
        const juriName = document.createElement('h5');
        juriName.innerText = this.instanceAppState.nomeJuri || 'Nome do Júri não definido';
        juriName.classList.add('mb-4');

        // Container para todo o conteúdo do relatório (listas)
        const reportContentContainer = document.createElement('div');
        reportContentContainer.classList.add('text-start', 'mb-4', 'w-100');
        reportContentContainer.style.maxWidth = '800px';

        /**
         * Helper para criar uma seção com título e lista de jurados.
         * @param {string} title - O título da seção.
         * @param {any[]} jurados - O array de jurados ou cédulas.
         */
        const createJuradoListSection = (title, jurados) => {
            const section = document.createElement('div');
            section.classList.add('mb-4');

            const subTitle = document.createElement('h6');
            subTitle.className = 'border-bottom pb-2 mb-3';
            subTitle.innerText = title;
            section.appendChild(subTitle);

            if (!jurados || jurados.length === 0) {
                const p = document.createElement('p');
                p.innerText = 'Nenhum jurado nesta categoria.';
                p.style.fontStyle = 'italic';
                section.appendChild(p);
                return section;
            }

            const list = document.createElement('ul');
            list.classList.add('list-group');

            jurados.forEach(item => {
                // Se o item for uma cédula descartada, pegue o jurado de dentro dela
                const jurado = item.juradoConselho ? item.juradoConselho : item;

                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.innerHTML = `<b>${jurado.nome}</b><br>CPF: ${jurado.cpf || 'Não informado'} | Profissão: ${jurado.profissao || 'Não informada'}`;
                list.appendChild(listItem);
            });

            section.appendChild(list);
            return section;
        };

        // Filtra os jurados da urna que não foram sorteados, recusados ou descartados
        const juradosSorteadosIds = new Set([
            ...this.instanceAppState.juradosConselhoSentenca.map(j => j.id),
            ...this.instanceAppState.juradosRecusadosAcusacao.map(j => j.id),
            ...this.instanceAppState.juradosRecusadosDefesa.map(j => j.id),
            ...this.instanceAppState.cedulasDescartadas.map(c => c.juradoConselho.id)
        ]);
        const titularesNaoSorteados = this.instanceAppState.juradosUrna.filter(j => !juradosSorteadosIds.has(j.id));

        reportContentContainer.appendChild(createJuradoListSection('Jurados no Conselho de Sentença', this.instanceAppState.juradosConselhoSentenca));
        reportContentContainer.appendChild(createJuradoListSection('Recusas da Acusação', this.instanceAppState.juradosRecusadosAcusacao));
        reportContentContainer.appendChild(createJuradoListSection('Recusas da Defesa', this.instanceAppState.juradosRecusadosDefesa));
        reportContentContainer.appendChild(createJuradoListSection('Cédulas Descartadas', this.instanceAppState.cedulasDescartadas));
        reportContentContainer.appendChild(createJuradoListSection('Jurados Titulares Não Sorteados', titularesNaoSorteados));
        reportContentContainer.appendChild(createJuradoListSection('Suplentes Não Sorteados', this.instanceAppState.suplentesRemanescentes));

        // Botões de Ação
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('d-flex', 'gap-3', 'mt-4');

        const printButton = document.createElement('button');
        printButton.classList.add('btn', 'btn-primary');
        printButton.innerText = 'Imprimir Relatório';
        printButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.onImprimirRelatorio();
        });

        const finishButton = document.createElement('button');
        finishButton.classList.add('btn', 'btn-success');
        finishButton.innerText = 'Finalizar Aplicação';
        finishButton.addEventListener('click', (event) => {
             event.preventDefault();
             this.onExportAndFinish(); // Delega a ação para o controller
 
        });

        actionContainer.append(printButton, finishButton);
 
        // Montagem final
        container.append(reportTitle, juriName, reportContentContainer, actionContainer);
 
        this.element = container;
        return this.element;
    }
}