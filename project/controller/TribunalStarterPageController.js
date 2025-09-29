import { FilesService } from "../utils/FilesService.js";
import { DOMUtils } from "../utils/DOMUtils.js";

export class TribunalStarterPageController {
    
    /**
     * 
     * @param {object} appState - variável de controle da página da aplicação
     */
    constructor(appState){
        this.appState = appState;
    }

    onVoltar(){
        this.appState.screenControl = -1;
    }

    onProsseguir(){
        this.appState.screenControl = 1;
    }

    async onSolicitaPlanilhaModelo(){
        const path = '/mock_data/jurados_mock_data_v2.xlsx';
        const blobFile = await FilesService.getBlob(path);

        DOMUtils.downloadBlob(blobFile, "modelo_planilha_jurados.xlsx");
    }
}