import { DOMUtils } from "../utils/DOMUtils.js";
import { ConselhoStartScreenService } from "../service/ConselhoStartScreenService.js";
import { ScreenCallsTests } from "../model/enums/ScreenCalls.js";
import { AppState } from "../appState.js"

export class ConselhoStarterPageController {

    /**
     * 
     * @param {AppState} appState 
     */
    constructor(appState) {
        this.appState = appState;
    }

    onVoltar() {
        this.appState.setScreenControl(-1);
    }

    async onProsseguir() {
        try {
            const blobFile = await DOMUtils.uploadFile();
            const juradosSorteados = await ConselhoStartScreenService.loadJuradosSorteadosFromFile(blobFile);

            const juradosTitulares = ConselhoStartScreenService.filterJuradosByType(juradosSorteados, 'Titular');
            const juradosSuplentes = ConselhoStartScreenService.filterJuradosByType(juradosSorteados, 'Suplente');

            console.log(juradosSorteados);

            this.appState.juradosTitulares = juradosTitulares;
            this.appState.juradosSuplentes = juradosSuplentes;
            this.appState.availableArrays = [juradosTitulares, juradosSuplentes];
            this.appState.selectedArray = this.appState.availableArrays[0] //Seta o array de juradosTitulares como o array selecionado.

            this.appState.setScreenControl(ScreenCallsTests.CHAMADA_JURADOS);
        } catch (error) {
            alert("Ocorreu um erro ao processar dados de jurados sorteados. Verifique o log da aplicação para mais detalhes. Erro apresentado: ", error);
            console.log("Erro ao processar dados de jurados sorteados: ", error);
            console.log("Dados de jurados titulares armazenados no estado da aplicação:")
            console.log(this.appState.juradosTitulares);
            console.log("Dados de jurados suplentes armazenados no estado da aplicação:")
            console.log(this.appState.juradosSuplentes);
        }
    }
}