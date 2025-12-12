import { appState } from '../appState.js';

export class GenerateAtaService {
    static generateAta(
        juradosTitulares = [], 
        juradosSuplentes = [],
        substituicoes = [],
        onComplete
    ) {
        appState.juradosTitulares = juradosTitulares;
        appState.juradosSuplentes = juradosSuplentes;
        appState.substituicoes = substituicoes;

        if (onComplete && typeof onComplete === 'function') {
            onComplete();
        }
    }
}