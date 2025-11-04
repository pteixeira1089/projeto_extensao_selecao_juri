import { JuradoSorteado } from "../model/JuradoSorteado.js";

/**
 * Provê métodos de lógica de negócio e utilitários
 * relacionados ao Conselho de Sentença e Sorteio.
 * * Esta classe contém apenas métodos estáticos e não deve ser instanciada.
 */
export class ConselhoSorteioService {
    
    /**
     * Encontra o primeiro jurado na lista que ainda não foi analisado (não possui status).
     * * @param {JuradoSorteado[]} juradosList - O array de jurados sorteados para pesquisar.
     * @returns {JuradoSorteado | undefined} - O primeiro jurado com `status` nulo ou indefinido, 
     * ou `undefined` se todos já foram analisados ou a lista é vazia.
     */
    static getFirstNotAnalisedJurado( juradosList ){
        // --- CORREÇÃO 1: Verificação de segurança ---
        // Usar === para comparação e checar se a lista é válida
        if (!juradosList || juradosList.length === 0) {
            console.log ('A lista de jurados analisada é vazia - seleção de jurado não analisado cancelada');
            return undefined; // Retorna undefined explicitamente
        }

        return juradosList.find(jurado => !jurado.status);
    }
}