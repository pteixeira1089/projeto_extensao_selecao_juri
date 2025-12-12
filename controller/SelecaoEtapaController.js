import { SheetExportService } from "../service/SheetExportService.js";
import { GenerateJuradosSorteadosService } from "../service/GenerateJuradosSorteadosService.js";

export class AtaController {
    /**
     * @param {object} appState - O estado global da aplicação
     */

    constructor(appState) {
        this.appState = appState;
    }

    //Esta função pode ser atribuída a um handler
    handleGenerateXlsxClick(){
        console.log('Controller: Ação de gerar planilha recebida');

        //1. Obter os dados do "Model" de estado (appState)
        const juradosTitulares = this.appState.juradosTitularesData || [];
        const juradosSuplentes = this.appState.juradosSuplentesData || [];

        if (juradosTitulares.length === 0 && juradosSuplentes.length === 0) {
            alert('Não há jurados sorteados para exportar.');
            return;
        }

        
        //2. Prepara os dados para chamada do serviço de exportação (chama o serviço de classificação dos jurados)
        const juradosTitularesExport = GenerateJuradosSorteadosService.generateJuradosSorteados(juradosTitulares, 'Titular');
        const juradosSuplentesExport = GenerateJuradosSorteadosService.generateJuradosSorteados(juradosSuplentes, 'Suplente');

        const juradosSorteados = [...juradosTitularesExport, ...juradosSuplentesExport];

        //3. Chama o serviço para executar a lógica de negócio [exportar os dados para a planilha]
        SheetExportService.export(juradosSorteados, 'jurados_sorteados');
    }

    handlePrintClick(){
        console.log('Controller: Ação de imprimir ata recebida');
        window.print();
    }

}