import { Jurado } from "./Jurado.js";
import { JuradoStatus } from "./JuradoStatus.js";
import { JuradoTipo } from "./JuradoTipo.js";

export class JuradoSorteado extends Jurado {

    /**
    * @param {Jurado} jurado - Instância da classe jurado
    * @param {string | null} tipoJurado
    * @param {string | null} status - The status of the sorted juror. Defaults to null.
    */
    constructor(jurado, tipoJurado, status = null) {
        super(
            jurado.id, jurado.nome, jurado.nomeSocial, jurado.rg, jurado.cpf,
            jurado.email, jurado.endereco, jurado.profissao, jurado.nascimento,
            jurado.genero, jurado.escolaridade
        );

        if (!Object.values(JuradoTipo).includes(tipoJurado)) {
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
        // Valida se o status fornecido existe no enum JuradoStatus.
        if (!Object.values(JuradoStatus).includes(status)) {
            throw new Error(`Status inválido. Use um dos valores de JuradoStatus. Fornecido: ${status}`);
        }
        
        /** @type {string} */
        this.status = status;
    }
}