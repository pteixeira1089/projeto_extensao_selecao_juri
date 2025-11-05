import { Jurado } from "./Jurado.js";
import { JuradoStatus } from "./JuradoStatus.js";

export class JuradoSorteado extends Jurado {
    // 1. Define valid statuses ONCE as a static constant.
    // It's part of the JuradoSorteado class definition itself.
    static TIPOS_VALIDOS = ['Titular', 'Suplente'];
    static STATUS_VALIDOS = [
        JuradoStatus.APTO,
        JuradoStatus.IMPEDIDO,
        JuradoStatus.DISPENSADO,
        JuradoStatus.AUSENTE,
        JuradoStatus.NAO_ANALISADO,
        null
    ];

    /**
    * @param {Jurado} jurado - Instância da classe jurado
    * @param {'Titular' | 'Suplente'} tipoJurado
    * @param {string | null} status - The status of the sorted juror. Defaults to null.
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
     * @param {string} newStatus
     */
    setStatus(newStatus) {
        this._validateAndSetStatus(newStatus);
    }
    
    /**
     * Private helper method to validate and set the status.
     * Not meant to be called from outside the class.
     * @private
     * @param {string} status 
     */
    _validateAndSetStatus(status) {
        // 2. Reference the static property using the class name.
        if (!JuradoSorteado.STATUS_VALIDOS.includes(status)) {
            throw new Error(`Status inválido. Use um dos seguintes valores: ${JuradoSorteado.STATUS_VALIDOS.join(', ')}`);
        }
        
        /** @type {string} */
        this.status = status;
    }
}