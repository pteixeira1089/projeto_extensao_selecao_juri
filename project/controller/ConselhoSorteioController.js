import { appState } from "../appState.js";
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import * as ConselhoSorteioRenderer from "../renderer/ConselhoSorteioRenderer.js"

/**
 * @typedef {object} AppState
 * @property {JuradoSorteado[]} selectedArray - the full list of selected jurados
 * @property {JuradoSorteado} juradoSelecionado - the currently displayed jurado
 * @property {Function} setJuradoSelecionado - callback function that changes the state of the application
 */
export class ConselhoSorteioController {
    constructor(appState) {
        /** @type {AppState} */
        this.appState = appState;

        /** @type {JuradoSorteado[]} */
        this.selectedArray = appState.selectedArray;

        /** @type {number} */
        this.totalJurados = appState.selectedArray.length;

        /** @type {JuradoSorteado} */
        this.juradoSelecionado = appState.juradoSelecionado;

        /** @type {number} */
        this.indiceJuradoSelecionado = appState.selectedArray.indexOf(appState.juradoSelecionado);
    }

    onAnterior() {
        const indiceAnterior = this.indiceJuradoSelecionado === 0
            ? (this.totalJurados - 1)
            : (this.indiceJuradoSelecionado - 1); //sets a carrousel like functionality
        this.appState.setJuradoSelecionado(this.selectedArray[indiceAnterior]);
    }

    onProximo() {
        const indicePosterior = (this.indiceJuradoSelecionado + 1) % this.totalJurados; //sets a carrousel like functionality
        this.appState.setJuradoSelecionado(this.selectedArray[indicePosterior]);
    }

    /**
     * Private helper method used in the events monitored by the controller
     * @param {string} status 
     */
    _alteraStatusJurado(status) {
        this.juradoSelecionado.setStatus(status);
        this.appState.setJuradoSelecionado(this.juradoSelecionado);
    }

    onApto(){
        this._alteraStatusJurado('presente - apto para sorteio');
    }

    onImpedido(){
        this._alteraStatusJurado('presente - impedido ou suspeito');
    }

    onDispensado(){
        this._alteraStatusJurado('presente - dispensado');
    }

    onAusente(){
        this._alteraStatusJurado('ausente');
    }
}