import { appState } from "../appState.js";
import { FormaConvocacaoSuplentes } from "../model/FormaConvocacaoSuplentes";
import { ModalService } from "../service/ModalService.js";

export class FormaConvocacaoSuplentesController{

    /**
     * @type { appState }
     */
    appState;

    /**
     * appstate class that manages the state transition of the application
     * @param {appState} appState 
     */
    constructor(appState) {
        this.appState = appState
    }

    async onOrdemDeConvocacao(){
        const confirm = await ModalService.confirm({
            title: "Confirmar forma de convocação de suplentes - Na ordem da convocação",
            message: "A forma de convocação de suplentes selecionada foi 'Na ordem da convocação'. Está correto?"
        })

        if (confirm){
            this.appState.formaConvocacaoSuplentes = FormaConvocacaoSuplentes.NA_ORDEM;

            console.log(`[controller] Confirmado o modo de convocação de suplentes: ${FormaConvocacaoSuplentes.NA_ORDEM}`);
            console.log(`Valor no appState: ${this.appState.formaConvocacaoSuplentes}`)
            return;
        }
    }

    async onSorteio(){
        const confirm = await ModalService.confirm({
            title: "Confirmar forma de convocação de suplentes - Sorteio",
            message: "A forma de convocação de suplentes selecionada foi 'Sorteio'. Está correto?"
        })

        if (confirm){
            this.appState.formaConvocacaoSuplentes = FormaConvocacaoSuplentes.SORTEIO;

            console.log(`[controller] Confirmado o modo de convocação de suplentes: ${FormaConvocacaoSuplentes.SORTEIO}`);
            console.log(`Valor no appState: ${this.appState.formaConvocacaoSuplentes}`)
            return;
        }
    }

}