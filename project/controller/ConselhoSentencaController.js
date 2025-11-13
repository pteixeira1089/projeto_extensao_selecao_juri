import { AppState, appState } from "../appState.js";
import { SelectedListPossibleValues } from "../model/AppStateConstants";

export class ConselhoSentencaController {
    
    /**
     * @type { AppState }
     */
    appState;

    /**
     * @param {AppState} appStateInstance - A instância do estado da aplicação.
     */
    constructor(appStateInstance = appState){
        this.appState = appStateInstance;
    }

    onUrna() {
        if (this.appState.selectedList === SelectedListPossibleValues.URNA || !this.appState.selectedList) {
            //Debugging
            console.log(`[controller] O valor de lista selecionada já aponta para Urna ou é vazio`)
            return;
        }

        const listaPresenca = this.appState.listObject;
        //Debugging
        console.log(`[controller] list object registrado no appState:`);
        console.log(listaPresenca);
        console.log(`[controller] Executando método para alternar listas`)

        //Alternate items in frontend
        listaPresenca.alternateItems();

        //Changes the state
        this.appState.selectedList = SelectedListPossibleValues.URNA;
        this.appState.changeSelectedArray();

        //Debugging
        console.log(`[controller] Lista alternada`);
    }

    onSuplentes() {
        if (this.appState.selectedList === SelectedListPossibleValues.SUPLENTES_RESERVA || !this.appState.selectedList) {
            //Debugging
            console.log(`[controller] O valor de lista selecionada já aponta para Suplentes Reserva ou é vazio`)
            return;
        }

        const listaPresenca = this.appState.listObject;
        //Debugging
        console.log(`[controller] list object registrado no appState:`);
        console.log(listaPresenca);
        console.log(`[controller] Executando método para alternar listas`)

        //Alternate items in frontend
        listaPresenca.alternateItems();

        //Changes the state
        this.appState.selectedList = SelectedListPossibleValues.SUPLENTES_RESERVA;
        this.appState.changeSelectedArray();

        //Debugging
        console.log(`[controller] Lista alternada`);
    }
}