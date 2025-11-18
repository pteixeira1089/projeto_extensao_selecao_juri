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
    appState} = {}) {
    
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


    const list = new ListaPresenca(propsLista);
    const listActionButtons = new ListaPresencaActions(propsHandlers);

    //Register the list object in the provided appState instance
    appState.listObject = list;

    const selectionDiv = document.getElementById('selectionDiv');
    const pageComposer = new PageComposer(selectionDiv);

    pageComposer.addComponent(listActionButtons);
    pageComposer.addComponent(list);

    const card = new CardJurado({
        juradoSorteado: appState.juradoSelecionado,
        handlers: propsCard
    });

    pageComposer.addComponent(card);
}