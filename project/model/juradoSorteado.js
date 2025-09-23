import { jurado } from ".jurado.js";

export class juradoSorteado extends jurado {
    /**
    * @param {jurado} jurado - Instância da classe jurado
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
        if (tipoJurado!=='Titular' && tipo!=='Suplente') {
            throw new Error("tipo de jurado deve ser 'Titular' ou 'Suplente'");
        }

        this.tipoJurado = tipoJurado;
    }
}