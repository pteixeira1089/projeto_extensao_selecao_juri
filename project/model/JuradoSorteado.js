import { Jurado } from "./Jurado.js";

export class JuradoSorteado extends Jurado {
    /**
    * @param {Jurado} jurado - Instância da classe jurado
    * @param {string} tipoJurado - 'Titular' ou 'Suplente'
    */
    constructor(jurado, tipoJurado) {
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

        //Validação simples do tipo de jurado
        if (tipoJurado!=='Titular' && tipoJurado!=='Suplente') {
            throw new Error("tipo de jurado deve ser 'Titular' ou 'Suplente'");
        }

        this.tipoJurado = tipoJurado;
    }
}