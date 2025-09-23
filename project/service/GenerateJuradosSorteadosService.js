import { JuradoSorteado } from "../model/JuradoSorteado.js";
import { jurado } from "../model/jurado.js";

export class GenerateJuradosSorteadosService {

    /**
     * Gera uma lista de jurados sorteados a partir de uma lista de jurados e um tipo (Titular ou Suplente).
     * @param { jurado[] } jurados - Array de objetos jurado.
    */
    static generateJuradosSorteados(jurados, tipo) {
        if (!Array.isArray(jurados) || jurados.length === 0) {
            console.warn('Nenhum jurado fornecido para classificação.');
            return [];
        }

        if (tipo !== 'Titular' && tipo !== 'Suplente') {
            console.error("Tipo inválido. Deve ser 'Titular' ou 'Suplente'.");
            throw new Error("Tipo deve ser 'Titular' ou 'Suplente'");
        }

        return jurados.map(jurado => new JuradoSorteado(jurado, tipo));

    }
}