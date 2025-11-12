import { juradosUrnaMock } from "../mock_data/test/juradosUrnaMock";
import { suplentesReservaMock } from "../mock_data/test/suplentesReservaMock";
import { JuradoConselho } from "../model/JuradoConselho";
import { ListaPresenca } from "../view/Shared/ListaPresenca";
import { PageComposer } from "./PageComposer";

export function renderPageStructure(){
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
 */
export function renderInitialElements({juradosUrna = juradosUrnaMock, suplentesReserva = suplentesReservaMock} = {}){
    const propsLista = {
        juradosTitulares: juradosUrna,
        juradosSuplentes: suplentesReserva
    };
    
    const urna = new ListaPresenca(propsLista);

    const selectionDiv = document.getElementById('selectionDiv');

    const pageComposer = new PageComposer(selectionDiv);

    pageComposer.addComponent(urna);
}