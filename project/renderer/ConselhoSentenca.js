import { juradosUrnaMock } from "../mock_data/test/juradosUrnaMock";
import { suplentesReservaMock } from "../mock_data/test/suplentesReservaMock";
import { AppState } from "../appState.js";
import { JuradoConselho } from "../model/JuradoConselho";
import { ListaPresenca } from "../view/Shared/ListaPresenca";
import { ListaPresencaActions } from "../view/Shared/ListaPresencaActions";
import { PageComposer } from "./PageComposer";

import { appState } from "../appState";
import { CardJurado } from "../view/Shared/CardJurado.js";
import { TipoCard } from "../model/enums/TipoCard.js";
import { Urna } from "../view/ComposicaoUrna/Urna.js";
import { OptionSelector } from "../view/Shared/OptionSelector.js";

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
    activeFilter = 0,
    appState } = {}) {

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
    }

    const propsCard = {
        tipoCard: TipoCard.CONSELHO_SENTENCA
    }

    const propsFilters = {
        "Ordem de convocação": firstFilterOption,
        "Sorteio": secondFilterOption
    }

    
    //Obtém PONTOS DE INSERÇÃO dos elementos
    const listDiv = document.getElementById('listContainer');
    const cardDiv = document.getElementById('cardInfoContainer');
    const resultDiv = document.getElementById('urnaCol');

    //Create pageComposers for each component of the application
    const pageComposerList = new PageComposer(listDiv);
    const pageComposerCard = new PageComposer(cardDiv);
    const pageComposerResult = new PageComposer(resultDiv);

    
    //Criação da LISTA DE JURADOS (URNA)
    const list = new ListaPresenca(propsLista);
    const listActionButtons = new ListaPresencaActions(propsHandlers);

    //Register the list object in the provided appState instance
    appState.listObject = list;

    pageComposerList.addComponent(listActionButtons);
    pageComposerList.addComponent(list);


    //Criação de área de filtro
    const titleFiltro = document.createElement('p')
    titleFiltro.innerText = `Forma de sorteio de suplentes`
    titleFiltro.classList.add('mt-3', 'mb-0');

    const optionsSelector = new OptionSelector();
    const filterOptions = optionsSelector.buildSimpleOptionList(
        propsFilters,
        0
    )

    listDiv.append(titleFiltro, filterOptions)
    
    //Criação do CARD DE JURADO
    //Sets the juradoSelecionado
    appState.setJuradoSelecionado(juradosUrnaMock[0]);

    const card = new CardJurado({
        juradoSorteado: appState.juradoSelecionado,
        handlers: propsCard
    });

    pageComposerCard.addComponent(card);


    //Criação do QUADRO DE CONSELHO DE SENTENÇA (resultado)
    const resultConselho = new Urna();
    pageComposerResult.addComponent(resultConselho);
}