export class ConselhoSorteioController {
    constructor(appState) {
        this.appState = appState;
        this.selectedArray = appState.selectedArray;
        this.totalJurados = appState.selectedArray.length;
        this.juradoSelecionado = appState.juradoSelecionado;
        this.indiceJuradoSelecionado = appState.selectedArray.indexOf(appState.juradoSelecionado);
    }

    onAnterior() {
        const indiceAnterior = this.indiceJuradoSelecionado === 0 
            ? (this.totalJurados - 1) 
            : (this.indiceJuradoSelecionado - 1); //sets a carrousel like functionality
        this.appState.setJuradoSelecionado(this.appState.juradosTitularesData[indiceAnterior]);
    }

    onProximo() {
        //Debugging:
        console.log('Debugging onProximo Controller:')
        console.log(`selectedArray: ${this.selectedArray}`);
        console.log(`Total de jurados: ${this.totalJurados}`);
        console.log(`Jurado selecionado: ${this.juradoSelecionado}`);
        console.log(`Índice do jurado selecionado: ${this.indiceJuradoSelecionado}`);


        const indicePosterior = (this.indiceJuradoSelecionado + 1) % this.totalJurados; //sets a carrousel like functionality
        this.appState.setJuradoSelecionado(this.appState.juradosTitularesData[indicePosterior]);
    }




}