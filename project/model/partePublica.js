import { Participante } from "./participante.js";

export class partePublica extends Participante {
    constructor(id, nome, instituicao, cargo) {
        super(id, nome, cargo);
        this.instituicao = instituicao;
    }

    getInstituicao() {
        return this.instituicao;
    }

    setInstituicao(instituicao) {
        this.instituicao = instituicao;
    }
}