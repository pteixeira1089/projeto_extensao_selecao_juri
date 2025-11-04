import { JuradoSorteado } from "./model/JuradoSorteado.js";
import { ListaPresenca } from "./view/ConselhoSorteio/ListaPresenca.js";

class AppState {

    /**
     * Used to register the ListaPresenca Object - used in Composição de Urna stage
     * @type {ListaPresenca | null}
     */
    listObject;

    /**
     * Used to store the juradoSorteado objects that will compose the urna
     * @type {JuradoSorteado[]}
     */
    juradosUrna;

    /**
     * Used to store the juradoSorteado objects that did not show up at the sorting event
     * @type {JuradoSorteado[]}
     */
    juradosAusentes;

    /**
     * Used to store the juradoSorteado objects that have the status 'impedido' or 'suspeito'
     * @type {JuradoSorteado[]}
     */
    juradosImpedidos;

    /**
     * Used to store the juradoSorteado objects that are released of duty by the judge's decision
     * @type {JuradoSorteado[]}
     */
    juradosDispensados;


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

        this.availableArrays = []; //array of available arrays to iterate over, in the application
        this.selectedArrayIndex = 0; //starting value of the seletctedArray index

        this.selectedArray = []; //will hold the array that is gonna be iterated when running the ConselhoSentencaSorteio page

        this.juradoSelecionado = {}; //will hold the jurado that is shown on the screen in the ConselhoSentencaSorteio page

        this.selectedList = null; //Holds the selected list (used in the ConselhoSorteio page [etapa de composição de urna]) 

        this.listObject = null; //Holds the list object (registered object)

        this.juradosUrna = [] //will hold the selected jurados for the urna
        this.juradosAusentes = [] //will hold the abscent jurados
        this.juradosImpedidos = [] //will hold the jurados presentes impedidos
        this.juradosDispensados = [] //will hold the jurados presentes dispensados

        this.contagemQuorum = 0 //will hold the count for deciding if the quorum is enough to proceed (CPP, art. 451)
        this.contagemUrna = 0 //will hold the count of celulas deposited in the urna
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
        if (this.subscribers.has(topic)) {
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

    updateCounters() {
        const qtdAptos = this.juradosUrna.length ?? 0;
        const qtdImpedidos = this.juradosImpedidos.length ?? 0;

        this.contagemQuorum = qtdAptos + qtdImpedidos;
        this.contagemUrna = qtdAptos;
    }

    addJuradoUrna(jurado) {
        //Debugging message
        console.log('Adicionando jurado na urna - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        this.juradosUrna.push(jurado);

        this.updateCounters();

        this.notify('addJuradoUrna', jurado);
    }

    /**
     * 
     * @param {JuradoSorteado} jurado - juradoSorteado that will be removed from Urna
     */
    removeJuradoUrna(jurado) {
        //Debugging message
        console.log('Removendo jurado da urna - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        const juradoId = jurado.id;

        this.juradosUrna = this.juradosUrna.filter(item => item.id !== juradoId)

        this.updateCounters();

        this.notify('removeJuradoUrna', jurado);
    }

    addJuradoAusente(jurado) {
        //Debugging message
        console.log('Adicionando jurado ausente - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        this.juradosAusentes.push(jurado);

        this.notify('addJuradoAusente', jurado);
    }

    removeJuradoAusente(jurado) {
        //Debugging message
        console.log('Removendo jurado ausente - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        this.juradosAusentes.filter(item => item.id !== jurado.id);

        this.notify('removeJuradoAusente', jurado);
    }

    addJuradoImpedido(jurado) {
        //Debugging message
        console.log('Adicionando jurado impedido - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        this.juradosImpedidos.push(jurado);

        this.updateCounters();

        this.notify('addJuradoImpedido', jurado);
    }

    removeJuradoImpedido(jurado) {
        //Debugging message
        console.log('Removendo jurado impedido - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        this.juradosImpedidos.filter(item => item.id !== jurado.id);

        this.updateCounters();

        this.notify('removeJuradoImpedido', jurado);
    }

    addJuradoDispensado(jurado) {
        //Debugging message
        console.log('Adicionando jurado dispensado - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        this.juradosDispensados.push(jurado);

        this.notify('addJuradoDispensado', jurado);
    }

    removeJuradoDispensado(jurado) {
        //Debugging message
        console.log('Removendo jurado dispensado - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        this.juradosDispensados.filter(item => item.id !== jurado.id);

        this.notify('removeJuradoDispensado', jurado);

    }


    changeSelectedArray() {
        // 1. Guard Clause: Se o array não existir ou estiver vazio, saia da função.
        //    Opcionalmente, defina um valor padrão para this.selectedArray.
        if (!this.availableArrays || this.availableArrays.length === 0) {
            this.selectedArray = null; // ou undefined, como preferir
            return;
        }

        const availableArraysQtt = this.availableArrays.length;

        // 2. Garanta que o índice inicial seja um número válido (ex: -1 ou 0)
        const currentIndex = this.selectedArrayIndex ?? -1;

        // 3. Calcule o próximo índice de forma segura
        const nextArrayIndex = (currentIndex + 1) % availableArraysQtt;

        // 4. Atualize as propriedades
        this.selectedArray = this.availableArrays[nextArrayIndex];
        this.selectedArrayIndex = nextArrayIndex; // <-- Importante: atualize o índice!

        //Notifica os callbacks inscritos no tópico 'selectArray'
        this.notify('selectArray', this.selectedArray);
    }
}

export const appState = new AppState();