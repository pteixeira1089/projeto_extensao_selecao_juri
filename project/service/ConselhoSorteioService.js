import { JuradoSorteado } from "../model/JuradoSorteado.js";
import { CPPQuoruns } from "../model/enums/ConstantesCPP.js";
import { JuradoStatus } from "../model/enums/JuradoStatus.js";

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
     * @param {JuradoSorteado} juradoSorteado - The juror to check.
     * @param {JuradoSorteado[]} selectedArray - The array to check against.
     * @returns {boolean} - True if the juror is in the list, false otherwise.
     */
    static isSelectedJurorInSelectedList ( juradoSorteado, selectedArray ){
        return selectedArray.includes(juradoSorteado);
    }
    
    /**
     * 
     * @param { object } props
     * @param { JuradoSorteado[] } props.juradosUrna - array of juror on the ballot box
     * @param { JuradoSorteado[] } props.juradoSorteado - array of juros categorized as 'Impedido ou Suspeito'
     * @returns { boolean } - returns true if minimal quorum is satisfied and false otherwise
     */
    static hasMinimalQuorum ( {juradosUrna, juradosImpedidos} ) {
        const qttJuradosUrna = juradosUrna.length;
        const qttJuradosImpedidos = juradosImpedidos.length;
        return (qttJuradosUrna + qttJuradosImpedidos >= CPPQuoruns.QUORUM_JURI)
    }
}