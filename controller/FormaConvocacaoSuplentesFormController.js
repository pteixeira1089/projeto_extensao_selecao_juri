import { appState } from "../appState.js";
import { FormaConvocacaoSuplentes } from "../model/enums/FormaConvocacaoSuplentes.js";
import { ScreenCallsTests } from "../model/enums/ScreenCalls.js";
import { ModalService } from "../service/ModalService.js";

export class FormaConvocacaoSuplentesController {

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

    onOrdemDeConvocacao() {
        this.appState.setFormaConvocacaoSuplentes(FormaConvocacaoSuplentes.NA_ORDEM);
    }

    onSorteio() {
        this.appState.setFormaConvocacaoSuplentes(FormaConvocacaoSuplentes.SORTEIO);
    }

    /**
     * 
     * @param {object} confirmProps 
     * @param {string} confirmProps.formaConvocacaoSuplentes
     * @param {number} confirmProps.numeroReus
     */
    async onConfirm(confirmProps) {
        // Converte o valor recebido (string) para um número inteiro.
        // O segundo argumento (radix 10) garante a conversão em base decimal.
        const numeroReus = parseInt(confirmProps.numeroReus, 10);
        const formaConvocacaoSuplentes = confirmProps.formaConvocacaoSuplentes;

        if (!Object.values(FormaConvocacaoSuplentes).includes(formaConvocacaoSuplentes)){
            const message = await ModalService.message({
                title: 'Forma de convocação de suplentes não informada',
                message: 'Escolha uma forma de convocação de suplentes ("em ordem" ou "sorteio")'
            })
            return;
        }

        if (!isNaN(numeroReus) && numeroReus >= 1) {
            const confirmData = await ModalService.confirm({
                title: 'Confirmar dados',
                message: `Os dados informados estão corretos? Número de réus: ${numeroReus}. Forma de covocação de suplentes: ${formaConvocacaoSuplentes}`
            })

            if (confirmData) {
                this.appState.setFormaConvocacaoSuplentes(formaConvocacaoSuplentes);
                this.appState.setQttReus(numeroReus);
                this.appState.setRecusasImotivadasDefesa(numeroReus);
                this.appState.setScreenControl(ScreenCallsTests.TESTE_UNITARIO_CONSELHO_SENTENCA_URNA);
                return;
            }
        } else {
            const message = await ModalService.message({
                title: 'Dados inconsistentes',
                message: 'A quantidade de réus deve ser um número inteiro maior ou igual a 1. Corrija a informação'
            })
            return;
        }
    }



}