import { JuradoSorteado } from "../model/JuradoSorteado.js";
import * as XLSX from 'xlsx';

export class ConselhoStartScreenService {

    /**
     * 
     * @param {object} blobFile - XLSX file containing jurados data, sorted on the first stage of the process (sorteio Tribunal do Juri)
     * @returns { JuradoSorteado[] } - array de jurados sorteados
     */
    static loadJuradosSorteadosFromFile(blobFile) {
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
                        const dadosBaseJurado = {
                            id: row['id'],
                            nome: row['nome'],
                            nomeSocial: row['nomeSocial'] || '',
                            rg: row['rg'],
                            cpf: row['cpf'],
                            email: row['email'],
                            endereco: row['endereco'],
                            profissao: row['profissao'],
                            nascimento: row['nascimento'],
                            genero: row['genero'],
                            escolaridade: row['escolaridade']
                        };

                        return new JuradoSorteado(
                            dadosBaseJurado,
                            row['tipoJurado']
                        );
                    });

                    //Converte o array em um objeto, indexado pelo ID do jurado
                    const juradosObject = {};
                    juradosArray.forEach(jurado => {
                        juradosObject[jurado.id] = jurado;
                    });

                    console.log("Jurados sorteados processados:", juradosObject);
                    console.log("Jurados sorteados em array:", juradosArray);

                    // Se tudo deu certo, resolve a Promise com o objeto de jurados sorteados
                    //resolve(juradosObject) //Use se precisar retornar o objeto, ao invés do array
                    resolve(juradosArray);

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
            reader.readAsArrayBuffer(blobFile);
        });
    }

    /**
     * 
     * @param {JuradoSorteado[]} juradosSorteados - array contendo jurados sorteados
     * @param {string} tipo - 'Titular' ou 'Suplente'
     * @returns - objeto de jurados do tipo especificado
     */
    static filterJuradosByType(juradosSorteados, tipo) {
        //return Object.entries(juradosSorteados).filter(([id, jurado]) => jurado.tipoJurado === tipo); //Use se o filtro precisar ser aplicado sobre um objeto
        return juradosSorteados.filter((jurado) => jurado.tipoJurado === tipo) //use se o filtro precisar ser aplicado sobre um array
    }
}