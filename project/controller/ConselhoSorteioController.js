import { appState } from "../appState.js";
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import * as ConselhoSorteioRenderer from "../renderer/ConselhoSorteioRenderer.js"
import { ListaPresenca } from "../view/ConselhoSorteio/ListaPresenca.js";
import { ConselhoSorteioService } from "../service/ConselhoSorteioService.js";
import { JuradoStatus } from "../model/JuradoStatus.js";
import { JuradoTipo } from "../model/JuradoTipo.js";
import { ModalService } from "../service/ModalService.js";

export class ConselhoSorteioController {

    /**
     * @type { appState }
     */
    appState;

    /**
     * 
     * @param { appState } appState - an appState class that manages the state transitions of the application
     */
    constructor(appState) {

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
        const jurado = this._getJuradoSelecionado();
        console.log('Jurado selecionado para alteração do status:');
        console.log(jurado);
        this.appState.updateJuradoStatus(jurado, status);
    }

    /**
     * Get the selected jurado from appState
     * @returns { JuradoSorteado }
     */
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
        this._alteraStatusJurado(JuradoStatus.APTO);
        this.onProximo();
    }

    onImpedido() {
        this._alteraStatusJurado(JuradoStatus.IMPEDIDO);
        this.onProximo();
    }

    onDispensado() {
        this._alteraStatusJurado(JuradoStatus.DISPENSADO);
        this.onProximo();
    }

    onAusente() {
        this._alteraStatusJurado(JuradoStatus.AUSENTE);
        this.onProximo();
    }

    onClearStatus() {
        this._alteraStatusJurado(JuradoStatus.NAO_ANALISADO);
    }

    onSuplenteRemanescente(){
        this._alteraStatusJurado(JuradoStatus.SUPLENTE_RESERVA);
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
        appState.selectedList = 'Titulares';
        appState.changeSelectedArray();
        //appState.selectedArray = appState.juradosTitularesData;
        const newJuradoSelecionado = ConselhoSorteioService.getFirstNotAnalisedJurado(appState.selectedArray);
        appState.setJuradoSelecionado(newJuradoSelecionado)

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
        appState.changeSelectedArray();
        //appState.selectedArray = appState.juradosSuplentesData;
        const newJuradoSelecionado = ConselhoSorteioService.getFirstNotAnalisedJurado(appState.selectedArray);
        appState.setJuradoSelecionado(newJuradoSelecionado)

        //Debugging
        console.log('Lista alternada para suplentes')
    }

    /**
     * 
     * @param {object} props - object containing a juror object and an event (click event, e.g)
     * @param {JuradoSorteado} propos.juradoSelecionado 
     * @param {MouseEvent} props.event
     */
    onSelectJuradoItem(juradoSelecionado) {

        // Check if the selected juror is already in the currently active list.
        // If so, we don't need to switch the lists (titulares/suplentes).
        const isJurorInCurrentList = ConselhoSorteioService.isSelectedJurorInSelectedList(juradoSelecionado, this.appState.selectedArray);

        if (!isJurorInCurrentList) {
            if (juradoSelecionado.tipoJurado === JuradoTipo.TITULAR) {
                this.onTitulares();
            } else {
                this.onSuplentes();
            }
        }

        appState.setJuradoSelecionado(juradoSelecionado);
    }

    /**
     * 
     * Handler for the 'fechar urna' action. It checks if all titular jurors have been categorized before proceeding.
     * @async
     */
    async onFecharUrna() {
        const titulares = this.appState.juradosTitulares;
        const suplentes = this.appState.juradosSuplentes;
        const qttAptos = this.appState.juradosUrna.length;
        const qttImpedidos = this.appState.juradosImpedidos.length;

        if (!ConselhoSorteioService.areAllJurorsCategorized(titulares)) {
            alert('NÃO É POSSÍVEL FECHAR A URNA: é necessário categorizar todos os titulares, primeiro');
            console.log('Jurados titulares:')
            console.log(titulares);
            return;
        }

        if (!ConselhoSorteioService.hasMinimalQuorum(qttAptos, qttImpedidos)) {
            alert('NÃO É POSSÍVEL FECHAR A URNA: não há quórum mínimo - CLASSIFIQUE OU CONVOQUE SUPLENTES')
            return;
        }

        if (!ConselhoSorteioService.areAllJurorsCategorized(suplentes)) {
            const userConfirmed = await ModalService.confirm({
                title: 'Confirmar Ação',
                message: 'Existem suplentes que ainda não foram classificados. Deseja classificá-los automaticamente como "Suplentes de Reserva" para prosseguir?'
            });

            if (userConfirmed) {
                suplentes.forEach((suplente) => {
                    if (!suplente.status) {
                        // Não precisa selecionar na UI, apenas atualiza o estado
                        this.appState.updateJuradoStatus(suplente, JuradoStatus.SUPLENTE_RESERVA);
                    }
                });
                alert('SUPLENTES NÃO CATEGORIZADOS FORAM CLASSIFICADOS COMO RESERVA.');
            } else {
                alert('Operação cancelada. Por favor, classifique os suplentes manualmente antes de prosseguir.');
                return; // Aborta a operação se o usuário cancelar
            }
        }

        console.log('[Controller] Ação de fechar urna e prosseguir foi acionada!');
        alert('Ação de "Prosseguir (fechar urna)" foi acionada! A lógica para a próxima etapa ainda precisa ser implementada.');
    }
}