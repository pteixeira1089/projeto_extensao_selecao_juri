import { appState } from '../appState.js';

export class GenerateAtaService {
    static generateAta(
        juradosTitulares = {}, 
        juradosSuplentes = {},
        onComplete
    ) {
        appState.juradosTitularesData = juradosTitulares;
        appState.juradosSuplentesData = juradosSuplentes;

        if (onComplete && typeof onComplete === 'function') {
            onComplete();
        }
    }
}