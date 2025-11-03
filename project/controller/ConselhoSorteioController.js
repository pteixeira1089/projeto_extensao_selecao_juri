import { appState } from "../appState.js";
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import * as ConselhoSorteioRenderer from "../renderer/ConselhoSorteioRenderer.js"
import { ListaPresenca } from "../view/ConselhoSorteio/ListaPresenca.js";

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

    _getJuradoSelecionado() {
        return appState.juradoSelecionado;
    }

    _getSelectedArray() {
        return appState.selectedArray;
    }

    _getTotalJurados() {
        return this._getSelectedArray().length;
    }

    _getIndiceJuradoSelecionado() {
        return this._getSelectedArray().indexOf(this._getJuradoSelecionado());
    }

    onApto() {
        this._alteraStatusJurado('presente - apto para sorteio');
        this.onProximo();
    }

    onImpedido() {
        this._alteraStatusJurado('presente - impedido ou suspeito');
        this.onProximo();
    }

    onDispensado() {
        this._alteraStatusJurado('presente - dispensado');
        this.onProximo();
    }

    onAusente() {
        this._alteraStatusJurado('ausente');
        this.onProximo();
    }

    onTitulares() {
        //Debugging
        console.log('Controlador de onTitulares acionado');
        console.log('Valor registrado no appState para lista ativa:');
        console.log(appState.selectedList);

        if (appState.selectedList === 'Titulares' || !appState.selectedList) {
            //Debugging
            console.log('o valor de lista selecionada no estado da aplicação (appState) é nulo ou já aponta para titulares. Operação não realizada.')
            return;
        }

        /**
         * @type { ListaPresenca }
         */
        const listaPresenca = appState.listObject;


        //Debugging
        console.log('list object registrado no appState foi resgatado. Testando abaixo a impressão do element correspondente');
        console.log(listaPresenca.element);
        console.log('Executando o método para alternar listas, do objeto listaPresenca')

        listaPresenca.alternateItems();
        appState.selectedList = 'Titulares'

        //Debugging
        console.log('Lista alternada para titulares!')
    }


    onSuplentes() {
        //Debugging
        console.log('Controlador de onSuplentes acionado');
        console.log('Valor registrado no appState para lista ativa:');
        console.log(appState.selectedList);

        if (appState.selectedList === 'Suplentes' || !appState.selectedList) {
            //Debugging
            console.log('o valor de lista selecionada no estado da aplicação (appState) é nulo ou já aponta para suplentes. Operação não realizada.')
            return;
        }

        /**
        * @type { ListaPresenca }
        */
        const listaPresenca = appState.listObject;

        //Debugging
        console.log('list object registrado no appState foi resgatado. Testando abaixo a impressão do element correspondente');
        console.log(listaPresenca.element);
        console.log('Executando o método para alternar listas, do objeto listaPresenca')

        listaPresenca.alternateItems();
        appState.selectedList = 'Suplentes'

        //Debugging
        console.log('Lista alternada para suplentes')
    }
}