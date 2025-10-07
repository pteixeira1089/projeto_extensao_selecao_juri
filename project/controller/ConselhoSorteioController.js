import { appState } from "../appState.js";
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import * as ConselhoSorteioRenderer from "../renderer/ConselhoSorteioRenderer.js"

/**
 * @typedef {object} AppState
 */
export class ConselhoSorteioController {
    constructor(appState) {
        /** @type {AppState} */
        this.appState = appState;
    }

    onAnterior() {
        const indiceAnterior = this._getIndiceJuradoSelecionado() === 0
            ? (this._getTotalJurados() - 1)
            : (this._getIndiceJuradoSelecionado() - 1); //sets a carrousel like functionality
        this.appState.setJuradoSelecionado(this._getSelectedArray()[indiceAnterior]);
    }

    onProximo() {
        const indicePosterior = (this._getIndiceJuradoSelecionado() + 1) % this._getTotalJurados(); //sets a carrousel like functionality
        this.appState.setJuradoSelecionado(this._getSelectedArray()[indicePosterior]);
    }

    /**
     * Private helper method used in the events monitored by the controller
     * @param {string} status 
     */
    _alteraStatusJurado(status) {
        this._getJuradoSelecionado().setStatus(status);
        this.appState.setJuradoSelecionado(this._getJuradoSelecionado());
    }

    _getJuradoSelecionado(){
        return appState.juradoSelecionado;
    }

    _getSelectedArray(){
        return appState.selectedArray;
    }

    _getTotalJurados(){
        return this._getSelectedArray().length;
    }

    _getIndiceJuradoSelecionado(){
        return this._getSelectedArray().indexOf(this._getJuradoSelecionado());
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