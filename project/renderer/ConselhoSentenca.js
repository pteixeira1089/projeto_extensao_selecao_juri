import { juradosUrnaMock } from "../mock_data/test/juradosUrnaMock";
import { suplentesReservaMock } from "../mock_data/test/suplentesReservaMock";
import { AppState } from "../appState.js";
import { JuradoConselho } from "../model/JuradoConselho";
import { ListaPresenca } from "../view/Shared/ListaPresenca";
import { ListaPresencaActions } from "../view/Shared/ListaPresencaActions";
import { PageComposer } from "./PageComposer";

import { appState as importedAppState } from "../appState";
import { CardJurado } from "../view/Shared/CardJurado.js";
import { TipoPage } from "../model/enums/TipoPage.js";
import { Urna } from "../view/Shared/Urna.js";
import { OptionSelector } from "../view/Shared/OptionSelector.js";
import { SortearJuradoButton } from "../view/ConselhoSentenca/SortearJuradoButton.js";
import { FormaConvocacaoSuplentes } from "../model/enums/FormaConvocacaoSuplentes.js";

export function renderPageStructure() {
    const divContent = document.getElementById('content');

    //Title
    const title = document.createElement('h3');
    title.textContent = `Sorteio de Conselho de sentença`;


    //Div structures

    const pageDiv = document.createElement('div');
    // A classe 'flex-row' garante a orientação em linha (horizontal).
    pageDiv.classList.add('d-flex', 'flex-row', 'justify-content-around', 'w-100');

    const listDiv = document.createElement('div');
    listDiv.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
    listDiv.id = 'selectionDiv';

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
    resultDiv.id = 'resultDiv';


    // Adiciona as divs de lista e resultado dentro da div geral da página
    pageDiv.append(listDiv, resultDiv);

    //Mounting
    // Adiciona o título e a div geral da página ao conteúdo principal
    divContent.append(title, pageDiv);
}

/**
 * 
 * @param {object} props 
 * @param {JuradoConselho[]} props.juradosUrna
 * @param {JuradoConselho[]} props.suplentesReserva
 * @param {AppState} props.appState
 */
export function renderInitialElements({
    juradosUrna = juradosUrnaMock,
    suplentesReserva = suplentesReservaMock,
    onPrimaryButton = () => alert("Primary button pressionado - INJETE CONTROLLERS"),
    onSecondaryButton = () => alert("Secondary button pressionado - INJETE CONTROLLERS"),
    firstFilterOption = () => alert("Botão de filtro 1 pressionado - INJETE CONTROLLERS"),
    secondFilterOption = () => alert("Botão de filtro 2 pressionado - INJETE CONTROLLERS"),
    onSortearJuradoButton = () => alert("Botão de sortear jurado pressionado - INJETE CONTROLERS"),
    activeFilter = 0, // Mantido para contexto
    appState = importedAppState } = {}) {

    //Prepare props for creating elements
    const propsLista = {
        juradosTitulares: juradosUrna,
        juradosSuplentes: suplentesReserva
    };

    const propsHandlers = {
        onPrimaryButton: onPrimaryButton,
        onSecondaryButton: onSecondaryButton,
        primaryButtonText: "Urna",
        secondaryButtonText: "Suplentes"
    };

    const propsCard = {
        tipoCard: TipoPage.CONSELHO_SENTENCA
    };

    const propsFilters = {
        "Ordem de convocação": [null, firstFilterOption], // The OptionSelector builder demands the array structure where the first position is an explanation text
        "Sorteio": [null, secondFilterOption] // In this case, there's no explanation text to show - that's why we use null
    };

    //Define a opção de filtro pré selecionada ao carregar a página
    const preSelectedOption = appState.formaConvocacaoSuplentes === FormaConvocacaoSuplentes.SORTEIO ? 1 : 0;

    const propsUrna = {
        tipoUrna: TipoPage.CONSELHO_SENTENCA
    };


    //Obtém PONTOS DE INSERÇÃO dos elementos (gerados pela classe PageSkeleton, usada no orquestrador geral)
    const contentDiv = document.getElementById('content');
    const listDiv = document.getElementById('listContainer');
    const cardAreaDiv = document.getElementById('cardContainer');
    const resultDiv = document.getElementById('urnaCol');

    //Create pageComposers for each component of the application
    const pageComposerList = new PageComposer(listDiv);
    const pageComposerResult = new PageComposer(resultDiv);


    //Title
    const title = document.createElement('h3');
    title.classList.add(
        'mb-5'
    )
    title.textContent = `Sorteio de Conselho de sentença`;

    contentDiv.prepend(title)


    //Criação da LISTA DE JURADOS (URNA)
    const list = new ListaPresenca(propsLista);
    const listActionButtons = new ListaPresencaActions(propsHandlers);

    //Register the list object in the provided appState instance
    appState.listObject = list;

    pageComposerList.addComponent(listActionButtons);
    pageComposerList.addComponent(list);


    //Criação de área de filtro
    const titleFiltro = document.createElement('p')
    titleFiltro.innerText = `Forma de convocação de suplentes`
    titleFiltro.classList.add('mt-3', 'mb-0');

    const optionsSelector = new OptionSelector();
    const filterOptions = optionsSelector.buildSimpleOptionList(
        propsFilters,
        preSelectedOption
    )

    filterOptions.classList.add('option-list-conselho');

    listDiv.append(titleFiltro, filterOptions)

    //Criação do botão de sorteio
    const bntSortearJurado = new SortearJuradoButton(onSortearJuradoButton).create();

    cardAreaDiv.prepend(bntSortearJurado);

    //Criação do QUADRO DE CONSELHO DE SENTENÇA (resultado)
    const resultConselho = new Urna(propsUrna);
    pageComposerResult.addComponent(resultConselho);
}