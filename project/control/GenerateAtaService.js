import { appState } from '../appState.js';

export class GenerateAtaService {
    static generateAta(
        juradosTitulares = [], 
        juradosSuplentes = [],
        substituicoes = [],
        onComplete
    ) {
        appState.juradosTitularesData = juradosTitulares;
        appState.juradosSuplentesData = juradosSuplentes;
        appState.substituicoes = substituicoes;

        if (onComplete && typeof onComplete === 'function') {
            onComplete();
        }
    }
}