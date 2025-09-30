import { DOMUtils } from "../utils/DOMUtils.js";
import { ConselhoStartScreenService } from "../service/ConselhoStartScreenService.js";

export class ConselhoStarterPageController {
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

            this.appState.juradosTitularesData = juradosTitulares;
            this.appState.juradosSuplentesData = juradosSuplentes;

            this.appState.setScreenControl('chamadaJurados');
        } catch (error) {
            alert("Ocorreu um erro ao processar dados de jurados sorteados. Verifique o log da aplicação para mais detalhes. Erro apresentado: ", error);
            console.log("Erro ao processar dados de jurados sorteados: ", error);
            console.log(this.appState.juradosTitularesData);
            console.log(this.appState.juradosSuplentesData);
        }
    }
}