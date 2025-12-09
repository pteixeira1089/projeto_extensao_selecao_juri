import { appState } from "../appState.js";
import { JuradoSorteado } from "../model/JuradoSorteado.js"
import * as ComposicaoUrnaRenderer from "../renderer/ComposicaoUrna.js";
import { ListaPresenca } from "../view/Shared/ListaPresenca.js";
import { ConselhoSorteioService } from "../service/ConselhoSorteioService.js";
import { JuradoStatus } from "../model/enums/JuradoStatus.js";
import { JuradoTipo } from "../model/JuradoTipo.js";
import { ModalService } from "../service/ModalService.js";
import { ListaTipo } from "../model/enums/ListaPresencaConstants.js";
import { ScreenCallsTests } from "../model/enums/ScreenCalls.js";

export class ComposicaoUrnaController {

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
        this.subscriptions = [];
    }

    /**
     * Remove todos os listeners de tópicos e limpa os componentes da UI
     * que foram criados por esta página. Essencial para evitar memory leaks.
     */
    destroy() {
        console.log('[ComposicaoUrnaController] Removendo inscrições');

        // Remove as inscrições (subscriptions)
        this.subscriptions.forEach(({ topic, callback }) => {
            const subscribers = this.appState.subscribers.get(topic);
            if (subscribers) {
                const index = subscribers.indexOf(callback);
                if (index > -1) subscribers.splice(index, 1);
            }
        });
        this.subscriptions = [];
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
        console.log(`[ComposicaoUrnaController.getSelectedArray] Selected array:`);
        console.log(appState.selectedArray);
        return appState.selectedArray;
    }

    _getTotalJurados() {
        return this._getSelectedArray().length;
    }

    _getIndiceJuradoSelecionado() {
        return this._getSelectedArray().indexOf(this._getJuradoSelecionado());
    }

    async onApto() {
        //Checks if the categorization is allowed
        const juradoSelecionado = this._getJuradoSelecionado();
        const areTitularesCategorized = ConselhoSorteioService.areAllJurorsCategorized(appState.juradosTitulares)
        const hasMinimalQuorum = ConselhoSorteioService.hasMinimalQuorum({
            juradosUrna: this.appState.juradosUrna,
            juradosImpedidos: this.appState.juradosImpedidos
        });
        
        //Idempotency check
        if (juradoSelecionado.status === JuradoStatus.APTO){
            this.onProximo();
            return;
        }

        //Idempotency check - for suplentes
        if (juradoSelecionado.tipoJurado === JuradoTipo.SUPLENTE &&
            juradoSelecionado.status === JuradoStatus.SUPLENTE_RESERVA &&
            hasMinimalQuorum
        ){
            this.onProximo();
            return;
        }

        if (juradoSelecionado.tipoJurado === JuradoTipo.SUPLENTE && !areTitularesCategorized){
            const messageModal = await ModalService.message({
                title: "Operação não permitida.",
                message: "Categorize todos os titulares antes de categorizar suplentes."
            });
            this.onTitulares();
            return;
        }

        //Checks if the juror has to be categorized as 'suplente reserva'
        if (juradoSelecionado.tipoJurado === JuradoTipo.SUPLENTE && hasMinimalQuorum) {
            const messageModal = await ModalService.message({
                title: "Quórum mínimo atingido",
                message: "O quórum mínimo exigido pelo CPP foi atingido. O suplente será categorizado como suplente reserva. Caso deseje categorizar todos os suplentes remanescentes como jurados reserva automaticamente, feche a urna."
            });
            
            this._alteraStatusJurado(JuradoStatus.SUPLENTE_RESERVA);
            this.onProximo();
            return;
        }

        this._alteraStatusJurado(JuradoStatus.APTO);
        this.onProximo();
    }

    onImpedido() {
        const juradoSelecionado = this._getJuradoSelecionado();

        //Idempotency check
        if (juradoSelecionado.status === JuradoStatus.IMPEDIDO) {
            this.onProximo();
            return;
        }
        
        this._alteraStatusJurado(JuradoStatus.IMPEDIDO);
        this.onProximo();
    }

    onDispensado() {
        const juradoSelecionado = this._getJuradoSelecionado();

        //Idempotency check
        if (juradoSelecionado.status === JuradoStatus.DISPENSADO) {
            this.onProximo();
            return;
        }

        this._alteraStatusJurado(JuradoStatus.DISPENSADO);
        this.onProximo();
    }

    onAusente() {
        const juradoSelecionado = this._getJuradoSelecionado();

        //Idempotency check
        if (juradoSelecionado.status === JuradoStatus.AUSENTE) {
            this.onProximo();
            return;
        }

        this._alteraStatusJurado(JuradoStatus.AUSENTE);
        this.onProximo();
    }

    onClearStatus() {
        const juradoSelecionado = this._getJuradoSelecionado();

        //Idempotency check
        if (juradoSelecionado.status === JuradoStatus.NAO_ANALISADO){
            this.onProximo();
            return;
        }

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

        if (appState.selectedList === ListaTipo.PRINCIPAL || !appState.selectedList) {
            //Debugging
            console.log('o valor de lista selecionada no estado da aplicação (appState) é nulo ou já aponta para titulares. Operação não realizada.')
            return;
        }

        // A única responsabilidade do controller é atualizar o estado.
        // A view (através do renderer inscrito no tópico) irá reagir a essa mudança.
        appState.setSelectedList(ListaTipo.PRINCIPAL);

        const firstNotAnalisedJuror = ConselhoSorteioService.getFirstNotAnalisedJurado(this.appState.juradosTitulares);

        appState.setJuradoSelecionado(firstNotAnalisedJuror);
    }


    onSuplentes() {
        //Debugging
        console.log('Controlador de onSuplentes acionado');

        // Se a lista de suplentes já está selecionada, não faz nada.
        if (appState.selectedList === ListaTipo.SECUNDARIA) {
            //Debugging
            console.log('o valor de lista selecionada no estado da aplicação (appState) é nulo ou já aponta para suplentes. Operação não realizada.')
            return;
        }

        // A única responsabilidade do controller é atualizar o estado.
        // A view (através do renderer inscrito no tópico) irá reagir a essa mudança.
        appState.setSelectedList(ListaTipo.SECUNDARIA);

        const firstNotAnalisedJuror = ConselhoSorteioService.getFirstNotAnalisedJurado(this.appState.juradosSuplentes);

        appState.setJuradoSelecionado(firstNotAnalisedJuror);
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
        const propsQuorum = {
            juradosUrna: this.appState.juradosUrna,
            juradosImpedidos: this.appState.juradosImpedidos
        }

        if (!ConselhoSorteioService.areAllJurorsCategorized(titulares)) {            
            await ModalService.message({
                title: "Operação não permitida",
                message: "Não é possível fechar a urna, pois é necessário categorizar todos os jurados titulares primeiro."
            });
            return;
        }

        if (!ConselhoSorteioService.hasMinimalQuorum(propsQuorum)) {
            await ModalService.message({
                title: "Quórum insuficiente",
                message: "Não é possível fechar a urna, pois não há o quórum mínimo de 15 jurados presentes (aptos + impedidos). Classifique mais jurados ou convoque suplentes."
            });
            return;
        }

        if (!ConselhoSorteioService.areAllJurorsCategorized(suplentes)) {
            const userConfirmed = await ModalService.confirm({
                title: 'Confirmar Ação',
                message: 'Existem suplentes que ainda não foram classificados. Deseja classificá-los automaticamente como "Suplentes de Reserva" para prosseguir?'
            });

            if (userConfirmed) {
                //DEBUGGING:
                console.log('[ComposicaoUrnaController] Confirmada a categorização automática de todos os suplentes');
                console.log('Suplentes em appState:')
                console.log(suplentes);

                suplentes.forEach((suplente) => {
                    if (!suplente.status) {
                        // Não precisa selecionar na UI, apenas atualiza o estado
                        // Altera diretamente a propriedade (sem setters) para não correr o risco de acionar nenhum notifier.
                        suplente.status = JuradoStatus.SUPLENTE_RESERVA;
                    }
                });
                alert('SUPLENTES NÃO CATEGORIZADOS FORAM CLASSIFICADOS COMO RESERVA.');
            } else {
                alert('Operação cancelada. Por favor, classifique os suplentes manualmente antes de prosseguir.');
                return; // Aborta a operação se o usuário cancelar
            }
        }

        // 1. Limpa as inscrições (se houver).
        this.destroy();

        // 2. Altera o estado da aplicação para renderizar a próxima tela.
        console.log('[ComposicaoUrnaController] Urna fechada. Alterando o estado da aplicação para que a UI navegue para a tela de definição de convocação de suplentes.');
        this.appState.setScreenControl(ScreenCallsTests.FORM_FORMA_CONVOCACAO_SUPLENTES);
    }
}