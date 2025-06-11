class Audiencia {
    constructor(id, data, nome, nroProcesso, tipo) {
        this.id = id;
        this.data = data; // Date object
        this.nome = nome;
        this.nroProcesso = nroProcesso;
        this.tipo = tipo; // dois tipos permitidos: 'selecao de júri' ou 'formação de conselho de sentença'
    }
}