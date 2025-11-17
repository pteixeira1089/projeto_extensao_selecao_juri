/**
 * Enum for ConselhoStatus possible values.
 * @readonly
 * @enum {string}
 */
export const ConselhoStatus = Object.freeze({
    NAO_SORTEADO: 'Não sorteado',
    SORTEADO_MEMBRO_CONSELHO: 'Sorteado - membro do Conselho de Sentença',
    SORTEADO_RECUSADO_MP: 'Sorteado - recusado pelo MP',
    SORTEADO_RECUSADO_DEFESA: 'Sorteado - recusado pela defesa',
    SUPLENTE_NAO_CONVOCADO: 'Suplente não convocado',
    NAO_ANALISADO: null
});