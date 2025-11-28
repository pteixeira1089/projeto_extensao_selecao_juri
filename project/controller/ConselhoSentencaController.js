import { AppState, appState } from "../appState.js";
import { SelectedListPossibleValues } from "../model/enums/AppStateConstants.js";
import { ConselhoStatus } from "../model/enums/ConselhoStatus.js";
import { ConselhoSorteioService } from "../service/ConselhoSorteioService.js"
import { ModalService } from "../service/ModalService.js";
import { MessageModal } from "../view/Shared/MessageModal.js";

export class ConselhoSentencaController {

    /**
     * @type { AppState }
     */
    appState;

    /**
     * @param {AppState} appStateInstance - A instância do estado da aplicação.
     */
    constructor(appStateInstance = appState) {
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

    async onSortearJurado() {
        const juradoSelecionado = appState.juradoSelecionado;

        if (juradoSelecionado && !ConselhoSorteioService.isConselhoJurorCategorized(juradoSelecionado)) {
            const propsModal = {
                title: "Categorização pendente",
                message: "Não é possível sortear um novo jurado enquanto o jurado atual não for categorizado"
            }

            const MessageModal = ModalService.message(propsModal);
        }

        if (this.appState.selectedList === SelectedListPossibleValues.URNA) {
            const urnaJurors = this.appState.juradosUrna;
            const areAvailableTitularJurorsToSort = ConselhoSorteioService.areAllUrnaJurorsSorted(urnaJurors);

            if (!areAvailableTitularJurorsToSort) {
                const propsModal = {
                    title: "Não há jurados titulares disponíveis",
                    message: "Não há mais jurados titulares disponíveis para sorteio. Convoque suplentes alternando para a lista de suplentes."
                }

                const MessageModal = ModalService.message(propsModal);
                return;
            }

            //From this point forward:
            //The user has the titular juros list selected AND
            //There are available jurors to be sorted

            const availableTitularJurorsToSort = this.appState.juradosUrna.filter(
                (jurado) => {
                    const possibleValues = [ConselhoStatus.NAO_ANALISADO, ConselhoStatus.NAO_SORTEADO, ConselhoStatus.SUPLENTE_NAO_CONVOCADO]
                    return possibleValues.includes(jurado.statusConselho);
                }
            );

            const juradoSorteado = ConselhoSorteioService.sorteiaJurado(availableTitularJurorsToSort);

            //Este método do appState notifica um tópico no qual o renderer de card está inscrito
            appState.setJuradoSelecionado(juradoSorteado);
        }
    }
}