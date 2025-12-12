import * as XLSX from 'xlsx';
import { Jurado } from '../model/Jurado.js'; // Ajuste o caminho para o seu model

export class TribunalStarterPageService {
    /**
     * Lê um arquivo de planilha (XLSX), extrai os dados dos jurados e os retorna como um array de objetos Jurado.
     * @param {File} file - O objeto de arquivo selecionado pelo usuário no input.
     * @returns {Promise<Jurado[]>} Uma Promise que resolve com um array de instâncias da classe Jurado.
     */
    static loadJuradosFromFile(file) {
        // A leitura de arquivos no navegador é assíncrona, então usamos uma Promise
        // para encapsular a lógica e podermos usar async/await no Controller.
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = event.target.result;
                    // Lê os dados do arquivo usando a biblioteca XLSX
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Pega o nome da primeira planilha
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    // Converte a planilha em um array de objetos JSON.
                    // Cada objeto representará uma linha da planilha.
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    console.log("Dados extraídos da planilha:", jsonData);

                    // Mapeia o JSON bruto para o nosso modelo de classe Jurado
                    const juradosArray = jsonData.map((row) => {
                        // IMPORTANTE: Aqui você deve mapear os nomes das colunas da SUA planilha
                        // para os parâmetros do construtor da classe Jurado.
                        // Exemplo: se na planilha a coluna se chama "Nome Completo", use row['Nome Completo'].
                        return new Jurado(
                            row['id'], // Gerando um ID simples
                            row['nome'],
                            row['nomeSocial'],
                            row['rg'],
                            row['cpf'],
                            row['email'],
                            row['endereco'],
                            row['profissão'],
                            row['nascimento'],
                            row['genero'],
                            row['escolaridade']
                        );
                    });

                    //Converte o array em um objeto, indexado pelo ID do jurado
                    const juradosObject = {};
                    juradosArray.forEach(jurado => {
                        juradosObject[jurado.id] = jurado;
                    });

                    console.log("Jurados processados:", juradosObject);
                    
                    // Se tudo deu certo, resolve a Promise com o array de jurados
                    resolve(juradosObject);

                } catch (error) {
                    console.error("Erro ao processar a planilha:", error);
                    // Se algo falhar, rejeita a Promise com o erro
                    reject(new Error("O arquivo da planilha parece estar corrompido ou em um formato inválido."));
                }
            };

            reader.onerror = (error) => {
                console.error("Erro ao ler o arquivo:", error);
                reject(new Error("Não foi possível ler o arquivo selecionado."));
            };

            // Inicia a operação de leitura do arquivo
            reader.readAsArrayBuffer(file);
        });
    }
}