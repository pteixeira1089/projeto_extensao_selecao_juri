import { JuradoSorteado } from "./model/JuradoSorteado.js";

class AppState {
    constructor() {
        this.subscribers = new Map();
        this.screenControl = -1;
        this.participantesData = [
            { tipo: 'magistrado', nome: 'Magistrado 1' },
            { tipo: 'membroMP', nome: 'Membro do MP 1' },
            { tipo: 'assistenteAcusacao', nome: 'Assistente de acusação 1' },
            { tipo: 'representanteOAB', nome: 'Representante da OAB 1' },
            { tipo: 'defensorConstituido', nome: 'Defensor constituído 1' },
        ];
        this.juradosTitularesData = [
            { nome: 'João da Silva', profissao: 'programador' },
            { nome: 'Maria Oliveira', profissao: 'professora' },
            { nome: 'Carlos Souza', profissao: 'engenheiro' },
            { nome: 'Ana Costa', profissao: 'advogada' },
            { nome: 'Pedro Santos', profissao: 'médico' }
        ];
        this.juradosSuplentesData = [
            { nome: 'Luiz Pereira', profissao: 'arquiteto' },
            { nome: 'Fernanda Lima', profissao: 'psicóloga' },
            { nome: 'Roberto Almeida', profissao: 'contador' },
            { nome: 'Patrícia Rocha', profissao: 'jornalista' },
            { nome: 'Ricardo Gomes', profissao: 'veterinário' }
        ];
        this.substituicoes = [];
        this.signer = {
            nome: 'Pedro G. Teixeira',
            cargo: 'servidor',
            matricula: 'RF 8973'
        };

        this.selectedArray = []; //will hold the array that is gonna be iterated when running the ConselhoSentencaSorteio page
        
        this.juradoSelecionado = {} //will hold the jurado that is shown on the screen in the ConselhoSentencaSorteio page
    }

    subscribe(topic, callback) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, []) // se o tópico não existir, cria o tópico com um array vazio de subscribers como valor
        }

        //Se o tópico existir, apenas inscrevee o callback no tópico (adiciona ao array)
        this.subscribers.get(topic).push(callback);
    }

    //Notifica as funções de callback inscritas no tópico, passando os dados necessários aos callbacks
    notify(topic, data) {
        if (this.subscribers.has(topic)){
            this.subscribers.get(topic).forEach(callback => callback(data));
        }
    }

    setScreenControl(value) {
        this.screenControl = value;
        
        //Notifica apenas os callbacks que se inscreveram no tópico screenControl
        this.notify('screenControl', this.screenControl);
    }

    /**
     * 
     * @param {Object} jurado - jurado that is gonna be selected for analysis in ConselhoSentencaSorteio page
     */
    setJuradoSelecionado(jurado) {
        this.juradoSelecionado = jurado;

        //Debugging message
        console.log('setJuradoSelecionado method was called')
        console.log(`Object passed to the method (juradoSorteado expected): ${jurado}`)
        
        //Notifica apenas os callbacks que se increveram no tópico 'juradoSelecionado'
        this.notify('juradoSelecionado', jurado);
    }
}

export const appState = new AppState();