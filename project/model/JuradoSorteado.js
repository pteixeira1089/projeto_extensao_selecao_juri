import { Jurado } from "./Jurado.js";

/**
 * Defines the allowed statuses for a sorted juror.
 * @typedef {'presente - apto para sorteio' | 'presente - impedido ou suspeito' | 'presente - dispensado' | 'ausente' | null} JuradoStatus
 */

export class JuradoSorteado extends Jurado {
    // 1. Define valid statuses ONCE as a static constant.
    // It's part of the JuradoSorteado class definition itself.
    static TIPOS_VALIDOS = ['Titular', 'Suplente'];
    static STATUS_VALIDOS = [
        'presente - apto para sorteio',
        'presente - impedido ou suspeito',
        'presente - dispensado',
        'ausente',
        null
    ];

    /**
    * @param {Jurado} jurado - Instância da classe jurado
    * @param {'Titular' | 'Suplente'} tipoJurado
    * @param {JuradoStatus} status - The status of the sorted juror. Defaults to null.
    */
    constructor(jurado, tipoJurado, status = null) {
        super(
            jurado.id, jurado.nome, jurado.nomeSocial, jurado.rg, jurado.cpf,
            jurado.email, jurado.endereco, jurado.profissao, jurado.nascimento,
            jurado.genero, jurado.escolaridade
        );

        if (!JuradoSorteado.TIPOS_VALIDOS.includes(tipoJurado)) {
            throw new Error(`Tipo de jurado inválido. Use: ${JuradoSorteado.TIPOS_VALIDOS.join(' ou ')}`);
        }
        this.tipoJurado = tipoJurado;

        // 3. Call the reusable private validator
        this._validateAndSetStatus(status);
    }
    
    /**
     * Sets the status of the juror after validation.
     * @param {JuradoStatus} newStatus
     */
    setStatus(newStatus) {
        this._validateAndSetStatus(newStatus);
    }
    
    /**
     * Private helper method to validate and set the status.
     * Not meant to be called from outside the class.
     * @private
     * @param {JuradoStatus} status 
     */
    _validateAndSetStatus(status) {
        // 2. Reference the static property using the class name.
        if (!JuradoSorteado.STATUS_VALIDOS.includes(status)) {
            throw new Error(`Status inválido. Use um dos seguintes valores: ${JuradoSorteado.STATUS_VALIDOS.join(', ')}`);
        }
        
        /** @type {JuradoStatus} */
        this.status = status;
    }
}