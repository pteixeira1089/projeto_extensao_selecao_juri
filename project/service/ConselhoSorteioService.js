import { JuradoSorteado } from "../model/JuradoSorteado.js";
import { appState } from "../appState.js";

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
        // Usar === para comparação e checar se a lista é válida
        if (!juradosList || juradosList.length === 0) {
            console.log ('A lista de jurados analisada é vazia - seleção de jurado não analisado cancelada');
            return undefined; // Retorna undefined explicitamente
        }

        return juradosList.find(jurado => !jurado.status) ?? juradosList[0];
    }

    
    /**
     * Verifica se todos os jurados em uma lista já foram categorizados (possuem um status).
     * @param { JuradoSorteado[] } juradosList - Array de jurados sorteados.
     * @returns { boolean } - Retorna `true` se todos os jurados tiverem um status, caso contrário, `false`.
     */
    static areAllJurorsCategorized ( juradosList ){
        if (!juradosList || juradosList.length === 0) {
            console.log('Foi passada uma lista vazia para o método - VERIFICAR POSSÍVEL ERRO')
            return false; // Uma lista vazia é considerada como falso
        }

        // Verifica se todos os jurados na lista possuem um 'status' truthy.
        return juradosList.every(jurado => jurado.status);
    }

    /**
     * 
     * @param {JuradoSorteado} juradoSorteado
     * @returns {boolean} - checks if the given juror is in the selected list, in the appState
     */
    isSelectedJurorInSelectedList ( juradoSorteado ){
        return appState.selectedArray.includes(juradoSorteado)
    }
    
    /**
     * 
     * @param { appState } appState - holds info/data about the instance of the application
     * @returns { boolean } - returns true if minimal qtt fixed in CPP (art. 463) is attended
     */
    hasMinimalQuorum ( appState ) {
        
    }
}