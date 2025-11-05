/**
 * Enum for JuradoSorteado status.
 * @readonly
 * @enum {string}
 */
export const JuradoStatus = Object.freeze({
    NAO_ANALISADO: null,
    APTO: 'presente - apto para sorteio',
    IMPEDIDO: 'presente - impedido ou suspeito',
    DISPENSADO: 'presente - dispensado',
    AUSENTE: 'ausente'
});