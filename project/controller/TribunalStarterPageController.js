import { FilesService } from "../utils/FilesService.js";
import { DOMUtils } from "../utils/DOMUtils.js";
import { TribunalStarterPageService } from "../service/TribunalStarterPageService.js";

export class TribunalStarterPageController {

    /**
     * 
     * @param {appState} appState - variável de controle da página da aplicação
     */
    constructor(appState) {
        this.appState = appState;
    }

    onVoltar() {
        this.appState.setScreenControl(-1);
    }

    async onProsseguir() {

        try {
            const file = await DOMUtils.uploadFile();
            
            if (file) {
                const jurados = await TribunalStarterPageService.loadJuradosFromFile(file);
                // Store jurados object in appState so the orchestrator (script.js) can read it
                this.appState.jurados = jurados;
                // Update total count if needed
                this.appState.totalJuradosAlistados = Object.keys(jurados).length;
                // Navigate to next screen
                this.appState.setScreenControl(1);
                return;
            }
        } catch(error){
            if (error.message === "Nenhum arquivo selecionado."){
                console.log("Upload cancelado pelo usuário.");
            } else {
                console.log('Erro ao carregar arquivo de jurados: ', error);
                alert("Houve um problema ao carregar a planilha. Verifique se o arquivo está no formato correto e tente novamente.\n\nDetalhes do erro: " + error.message);
            }
        }
    } 

    async onSolicitaPlanilhaModelo() {
            try {
                const path = '/mock_data/jurados_mock_data_v2.xlsx';
                const blobFile = await FilesService.getBlob(path);

                DOMUtils.downloadBlob(blobFile, "modelo_planilha_jurados.xlsx");
            } catch (error) {
                console.error("Erro ao baixar a planilha modelo:", error);
            }
        }
    }