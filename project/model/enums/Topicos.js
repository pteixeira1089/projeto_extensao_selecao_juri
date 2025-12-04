/**
 * Enum for registering topics of the application - used to notify rendering and other functions
 * @readonly
 * @enum {string}
 */
export const Topicos = Object.freeze({
    CEDULA_DESCARTADA: 'cedulaDescartada',
    JURADO_SELECIONADO: 'juradoSelecionado',
    CONTADORES_CONSELHO_ATUALIZADOS: 'contadoresConselhoAtualizados',
    RECUSA_ACUSACAO: 'recusaAcusacao',
    RECUSA_DEFESA: 'recusaDefesa',
    JURADO_ADICIONADO_AO_CONSELHO: 'juradoAdicionadoConselho'
});