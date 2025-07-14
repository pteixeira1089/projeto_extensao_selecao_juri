export class Participante {
    constructor(id, nome, tipo, cargo = '', matricula = '') {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.cargo = cargo;
        this.matricula = matricula;
    }
}