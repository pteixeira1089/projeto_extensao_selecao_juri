import * as XLSX from 'xlsx';

export class FinalReportController {
    /**
     * @param {import('../appState.js').AppState} appState
     */
    constructor(appState) {
        this.appState = appState;
    }

    /**
     * Manipulador para o evento de finalização. Exporta os dados e executa o callback final.
     */
    handleExportAndFinish() {
        this.exportToExcel();
        // Aqui você pode adicionar qualquer outra lógica de finalização,
        // como limpar o estado, redirecionar, etc.
        alert('Aplicação finalizada e relatório exportado com sucesso!');
        console.log('[FinalReportController] Aplicação finalizada.');
    }

    /**
     * Exporta os dados do relatório para um arquivo Excel (.xlsx).
     * Cada seção do relatório se torna uma aba na planilha.
     */
    exportToExcel() {
        const workbook = XLSX.utils.book_new();
        const juriName = this.appState.nomeJuri || 'SorteioJuri';
        const fileName = `${juriName.replace(/ /g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;

        const addSheetToWorkbook = (sheetName, data, isCedulaDescartada = false) => {
            let processedData;

            if (!data || data.length === 0) {
                processedData = [{ Status: 'Nenhum jurado nesta categoria.' }];
            } else if (isCedulaDescartada) {
                processedData = data.map(item => ({
                    Nome: item.juradoConselho.nome,
                    CPF: item.juradoConselho.cpf || 'Não informado',
                    Profissão: item.juradoConselho.profissao || 'Não informada',
                    'Motivo do Descarte': item.motivo || 'Não informado'
                }));
            } else {
                processedData = data.map(jurado => ({
                    Nome: jurado.nome,
                    CPF: jurado.cpf || 'Não informado',
                    Profissão: jurado.profissao || 'Não informada'
                }));
            }

            const worksheet = XLSX.utils.json_to_sheet(processedData);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        };

        const juradosSorteadosIds = new Set([
            ...this.appState.juradosConselhoSentenca.map(j => j.id),
            ...this.appState.juradosRecusadosAcusacao.map(j => j.id),
            ...this.appState.juradosRecusadosDefesa.map(j => j.id),
            ...this.appState.cedulasDescartadas.map(c => c.juradoConselho.id)
        ]);
        const titularesNaoSorteados = this.appState.juradosUrna.filter(j => !juradosSorteadosIds.has(j.id));

        addSheetToWorkbook('Conselho de Sentença', this.appState.juradosConselhoSentenca);
        addSheetToWorkbook('Recusas Acusação', this.appState.juradosRecusadosAcusacao);
        addSheetToWorkbook('Recusas Defesa', this.appState.juradosRecusadosDefesa);
        addSheetToWorkbook('Cédulas Descartadas', this.appState.cedulasDescartadas, true);
        addSheetToWorkbook('Titulares Não Sorteados', titularesNaoSorteados);
        addSheetToWorkbook('Suplentes Não Sorteados', this.appState.suplentesRemanescentes);

        XLSX.writeFile(workbook, fileName);
    }
}