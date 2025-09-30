import { Jurado } from "./Jurado.js";

export class JuradoSorteado extends Jurado {
    /**
    * @param {Jurado} jurado - Instância da classe jurado
    * @param {string} tipoJurado - 'Titular' ou 'Suplente'
    * @param {string|null} status - O status do jurado sorteado. O valor padrão é null
    */
    constructor(jurado, tipoJurado, status = null) {
        super(
            jurado.id, 
            jurado.nome, 
            jurado.nomeSocial, 
            jurado.rg, 
            jurado.cpf, 
            jurado.email, 
            jurado.endereco, 
            jurado.profissao, 
            jurado.nascimento, 
            jurado.genero, 
            jurado.escolaridade
        );

        // Validação do tipo de jurado (também pode ser melhorada)
        const tiposValidos = ['Titular', 'Suplente'];
        if (!tiposValidos.includes(tipoJurado)) {
            throw new Error("Tipo de jurado deve ser 'Titular' ou 'Suplente'");
        }
        this.tipoJurado = tipoJurado;

        // --- VALIDAÇÃO DO STATUS (FORMA ELEGANTE) ---
        const statusValidos = [
            'presente - apto para sorteio',
            'presente - impedido ou suspeito',
            'presente - dispensado',
            'ausente',
            null // null também é um valor válido
        ];

        if (!statusValidos.includes(status)) {
            throw new Error(`Status inválido. Use um dos seguintes valores: ${statusValidos.join(', ')}`);
        }
        
        this.status = status;
    }
}