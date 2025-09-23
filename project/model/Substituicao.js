import { Jurado } from "./jurado.js"

export class Substituicao {
    
    /**
     * 
     * @param {Jurado} juradoSubstituido 
     * @param {Jurado} juradoSubstituto 
     * @param {string} motivo 
     */
    constructor(
        juradoSubstituido,
        juradoSubstituto,
        motivo
    ) {
        this.juradoSubstituido = juradoSubstituido
        this.juradoSubstituto = juradoSubstituto;
        this.motivo = motivo
    }
}