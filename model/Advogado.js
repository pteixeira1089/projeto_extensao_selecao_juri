import { Participante } from "./Participante.js";

export class Advogado extends Participante {
    constructor(id, nome, nroRegistroOab, cargo) {
        super(id, nome, cargo);
        this.nroRegistroOab = nroRegistroOab;
    }

    getNroRegistroOab() {
        return this.nroRegistroOab;
    }

    setNroRegistroOab(nroRegistroOab) {
        this.nroRegistroOab = nroRegistroOab;
    }
}