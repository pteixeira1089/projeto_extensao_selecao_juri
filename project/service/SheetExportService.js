import * as XLSX from 'xlsx';

export class SheetExportService {
    
    /**Gera e dispara o download de uma planilha Excel (.xlsx) a partir de um array de jurados
     * @param {object[]} dados - Array de objetos onde cada chave representa um atributo a ser incluído em uma planilha.
     * @param {string} filename - Nome do arquivo para o download (sem extensão).xlsx).
     */
    static export(dados, filename) {

        if (!dados || dados.length === 0) {
            console.warn('Não há dados para exportar.');
            return;
        }

        try{
            // O serviço é genérico: não faz nenhuma transformação dos dados recebidos;
            // Presume que os dados recebidos já estão tratados e prontos para exportação.
            // Tratamentos devem ser feitos no controller ou em outro serviço específico.
            
            // Cria uma planilha a partir dos dados
            const worksheet = XLSX.utils.json_to_sheet(dados);

            // Cria uma nova pasta de trabalho (workbook) e adiciona a planilha
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Jurados Sorteados');

            // Dispara o download do arquivo Excel
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        } catch (error) {
            console.error('Erro ao gerar a planilha Excel:', error);
            alert('Ocorreu um erro ao gerar a planilha. Verifique o console para mais detalhes.');
        }
    }
}