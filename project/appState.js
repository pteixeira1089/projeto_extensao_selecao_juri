import { JuradoSorteado } from "./model/JuradoSorteado.js";
import { ListaPresenca } from "./view/Shared/ListaPresenca.js";
import { Urna } from "./view/Shared/Urna.js";
import { JuradoStatus } from "./model/enums/JuradoStatus.js";
import { JuradoTipo } from "./model/JuradoTipo.js";
import { FormaConvocacaoSuplentes } from "./model/enums/FormaConvocacaoSuplentes.js";
import { JuradoConselho } from "./model/JuradoConselho.js";

export class AppState {

    /**
     * Used to register the ListaPresenca Object - used in Composição de Urna stage
     * @type {ListaPresenca | null}
     */
    listObject;

    /**
     * A string reference to the selected array of tha application (when using a ListaPresenca component, that has two lists and can alternate between them)
     * @type {string | null}
     */
    selectedList;

    /**
     * Holds the selected array of the application (when analysing two separate arrays, displayed in ListaPresenca component)
     * @type { JuradoSorteado[] | JuradoConselho[] | null }
     */
    selectedArray;

    /**
     * Holds the available arrays of JuradoSorteado or JuradoConselho to iterate over
     * @type { JuradoSorteado[][] | JuradoConselho[][] }
     */
    availableArrays;

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

    /**
     * Used to store suplentes that will not compose the Urna, but have to stay available for future use in Conselho de Sentença sorting process
     * @type {JuradoSorteado[]}
     */
    suplentesRemanescentes;

    /**
     * Store an array of titular jurors
     * @type { JuradoSorteado[] }
     */
    juradosTitulares;

    /**
     * Store an array of suplentes jurors
     * @type { JuradoSorteado[] }
     */
    juradosSuplentes;

    /**
     * Used to register the Urna Object - used in Composição de Urna stage
     * @type {Urna | null}
     */
    urnaObject;

    /**
     * Register the way suplentes are convocated 
     * @type {typeof FormaConvocacaoSuplentes[keyof typeof FormaConvocacaoSuplentes] | null}
     */
    formaConvocacaoSuplentes;

    /**
     * Register the number or reus
     * @type {number | null}
     */
    qttReus;

    /**
     * Register the number of recusas imotivadas MPF can use
     * @type {number | null}
     */
    qttRecusasImotivadasAcusacao;

    /**
     * Register the number of recusas imotivadas DEFESA can use
     * @type {number | null}
     */
    qttRecusasImotivadasDefesa;


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

        this.juradosTitulares = [];
        this.juradosSuplentes = [];

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
        this.suplentesRemanescentes = [] //will hold the suplentes remanescentes (available for use in the Conselho de Sentença sorting process)

        this.contagemQuorum = 0 //will hold the count for deciding if the quorum is enough to proceed (CPP, art. 451)
        this.contagemUrna = 0 //will hold the count of celulas deposited in the urna

        this.urnaObject = null; //Holds the urna object (registered object)

        this.formaConvocacaoSuplentes = null; //Holds the way suplentes are convocated
        
        //Assumes the value for reus (default) is 1
        this.qttReus = 1;
        this.qttRecusasImotivadasAcusacao = 3;
        this.qttRecusasImotivadasDefesa = 3
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

        console.log('[appState setScreenControl] Function called');

        //Notifica apenas os callbacks que se inscreveram no tópico screenControl
        this.notify('screenControl', this.screenControl);
        console.log('Notified screenControl topic')
    }

    /**
     * 
     * @param {Object} jurado - jurado that is gonna be selected for analysis in ConselhoSentencaSorteio page
     */
    setJuradoSelecionado(jurado) {
        this.juradoSelecionado = jurado;

        //Debugging message
        console.log('setJuradoSelecionado method was called');
        console.log(`Object passed to the method (juradoSorteado expected):`);
        console.log(jurado);

        //Notifica apenas os callbacks que se increveram no tópico 'juradoSelecionado'
        this.notify('juradoSelecionado', jurado);
    }

    /**
     * Helper method to remove a juror from all status-based lists.
     * This ensures the juror is only in one list at a time.
     * @param {string} juradoId - The ID of the juror to remove.
     */
    _removeJuradoFromAllStatusLists(juradoId) {
        this.juradosUrna = this.juradosUrna.filter(item => item.id !== juradoId);
        this.juradosAusentes = this.juradosAusentes.filter(item => item.id !== juradoId);
        this.juradosImpedidos = this.juradosImpedidos.filter(item => item.id !== juradoId);
        this.juradosDispensados = this.juradosDispensados.filter(item => item.id !== juradoId);
        this.suplentesRemanescentes = this.suplentesRemanescentes.filter(item => item.id !== juradoId)
    }

    /**
     * Updates the status of a juror and moves them to the appropriate list in appState.
     * This centralizes the logic for status-based list management.
     * @param {JuradoSorteado} jurado - The juror object whose status is being updated.
     * @param {string} newStatus - The new status for the juror (from JuradoStatus enum).
     */
    updateJuradoStatus(jurado, newStatus) {
        // Debugging message
        console.log('O método updateJuradoStatus, no appState, foi chamado')
        console.log(`Updating juror status for ${jurado.nome} to ${newStatus}`);

        // 1. Set the status on the JuradoSorteado object (if compatible)
        if (jurado.tipoJurado === JuradoTipo.TITULAR && newStatus === JuradoStatus.SUPLENTE_RESERVA) {
            console.log('[appState] Operação não realizada: não se pode classificar um jurado titular como suplente remanescente!');
            return;
        }

        jurado.setStatus(newStatus);

        // 2. Remove the juror from all status-based lists to ensure exclusivity
        this._removeJuradoFromAllStatusLists(jurado.id);

        // 3. Add the juror to the correct list based on the new status
        // The addJuradoX methods are idempotent and handle their own notifications
        switch (newStatus) {
            case JuradoStatus.APTO:
                this.addJuradoUrna(jurado);
                break;
            case JuradoStatus.IMPEDIDO:
                this.addJuradoImpedido(jurado);
                break;
            case JuradoStatus.DISPENSADO:
                this.addJuradoDispensado(jurado);
                break;
            case JuradoStatus.AUSENTE:
                this.addJuradoAusente(jurado);
                break;
            case JuradoStatus.NAO_ANALISADO:
                // Jurors with 'NAO_ANALISADO' status are not in any specific status list.
                break;
            case JuradoStatus.SUPLENTE_RESERVA:
                this.addSuplenteRemanescente(jurado);
                break;
            default:
                console.warn(`[AppState] Unhandled juror status: ${newStatus} for juror ${jurado.nome}`);
                break;
        }

        // 4. Update counters if necessary (status changes affect quorum/urna counts)
        this.updateCounters();

        // 5. Notify subscribers about the status change.
        // This can be a generic notification for UI components that need to react
        // to any status change of a juror.
        this.notify('juradoStatusChanged', jurado);
    }

    updateCounters() {
        const qtdAptos = this.juradosUrna.length ?? 0;
        const qtdImpedidos = this.juradosImpedidos.length ?? 0;

        this.contagemQuorum = qtdAptos + qtdImpedidos;
        this.contagemUrna = qtdAptos;

        //Notifica os callbacks que se inscreveram no tópico 'urnaCountChanged'
        this.notify('urnaCountChanged', this.contagemUrna);
    }

    addJuradoUrna(jurado) {
        //Debugging message
        console.log('Adicionando jurado na urna - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        const alreadyExists = this.juradosUrna.some(item => item.id === jurado.id);

        if (!alreadyExists) {
            this.juradosUrna.push(jurado);
        }

        this.updateCounters();

        this.notify('addJuradoUrna', jurado);
    }

    addJuradoAusente(jurado) {
        //Debugging message
        console.log('Adicionando jurado ausente - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        const alreadyExists = this.juradosAusentes.some(item => item.id === jurado.id);

        if (!alreadyExists) {
            this.juradosAusentes.push(jurado);
        }

        this.notify('addJuradoAusente', jurado);
    }

    addJuradoImpedido(jurado) {
        //Debugging message
        console.log('Adicionando jurado impedido - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        const alreadyExists = this.juradosImpedidos.some(item => item.id === jurado.id);

        if (!alreadyExists) {
            this.juradosImpedidos.push(jurado);
        }

        this.updateCounters();

        this.notify('addJuradoImpedido', jurado);
    }

    addJuradoDispensado(jurado) {
        //Debugging message
        console.log('Adicionando jurado dispensado - NO NÍVEL DO ESTADO DA APLICAÇÃO (appState)');
        console.log('Objeto passado ao método:');
        console.log(jurado);

        const alreadyExists = this.juradosDispensados.some(item => item.id === jurado.id);

        if (!alreadyExists) {
            this.juradosDispensados.push(jurado);
        }

        this.notify('addJuradoDispensado', jurado);
    }

    addSuplenteRemanescente(jurado) {
        //Debugging message
        console.log('[appState] Método addSuplenteRemanescente em execução')
        console.log('Objeto passado ao método:')
        console.log(jurado)

        //Variável que armazena o check de existência do jurado remanescente no array
        //Presume-se, por padrão, que o jurado não está no array
        //let alreadyExists = false

        //if(this.suplentesRemanescentes){
        const alreadyExists = this.suplentesRemanescentes.some(item => item.id === jurado.id);
        //}


        if (!alreadyExists) {
            this.suplentesRemanescentes.push(jurado);
        }

        this.notify('addSuplenteRemanescente');
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

    /**
     * 
     * @param {number} qttReus - the number of reus
     */
    setQttReus(qttReus) {
        if (Number.isInteger(qttReus) && qttReus >= 1) {
           this.qttReus = qttReus
        }
    }

    /**
     * 
     * @param {string} formaConvocacao 
     */
    setFormaConvocacaoSuplentes(formaConvocacao){
        console.log('[appState] alterando forma de convocação de suplentes para o valor abaixo:')
        console.log(`[appState] ${formaConvocacao}`)
        if (Object.values(FormaConvocacaoSuplentes).includes(formaConvocacao)){
            this.formaConvocacaoSuplentes = formaConvocacao;
            console.log(`[appState] Forma de convocação alterada no appState para ${formaConvocacao}`)
        }
    }

    /**
     * 
     * @param {number} qttReus 
     */
    setRecusasImotivadasDefesa(qttReus){
        if (Number.isInteger(qttReus) && qttReus >= 1) {
            this.qttRecusasImotivadasDefesa = 3*qttReus;
        }
    }
}

export const appState = new AppState();