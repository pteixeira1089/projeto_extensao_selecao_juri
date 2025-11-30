import { JuradoConselho } from "./JuradoConselho";

export class CedulaDescartada {
    /**
     * @param {object} props
     * @param {JuradoConselho} props.juradoConselho - O jurado que teve a cédula descartada.
     * @param {string} props.justificativa - A justificativa para o descarte da cédula.
     */
    constructor({ juradoConselho, justificativa }) {
        if (!juradoConselho) {
            throw new Error("JuradoConselho é obrigatório para uma CédulaDescartada.");
        }
        if (!justificativa || justificativa.trim() === "") {
            throw new Error("Justificativa é obrigatória para uma CédulaDescartada.");
        }

        this.juradoConselho = juradoConselho;
        this.justificativa = justificativa;
    }
}
