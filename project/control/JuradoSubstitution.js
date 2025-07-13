import { Substituicao } from "../model/substituicao.js"
import { appState } from "../appState.js";

/**
 * 
 * @param {Object<string, Object>} sortedJurados - lista de chaves de jurados já sorteados
 * @param {number} totalJuradosAlistados - total de jurados selecionados para sorteio
 * @param {Object<string, Object>} jurados - coleção de jurados
 * @param {Object<string, Object>} substitutedJurados - Objeto de jurados substituídos
 * @returns {[string, Object] | null} - par string, jurado, representando o jurado sorteado e seu id
 */

export function sortJuradoSubstitution(
    sortedJurados,
    totalJuradosAlistados,
    jurados,
    substitutedJurados
) {
    if (Object.keys(sortedJurados).length >= totalJuradosAlistados) {
        return null;
    }

    //Build an array of jurado's keys
    const juradoKeys = Object.keys(jurados);

    let juradoKey;
    let jurado;

    do {
        const randomIndex = Math.floor(Math.random() * totalJuradosAlistados);
        //jurado = Object.entries(jurados)[randomIndex];
        juradoKey = juradoKeys[randomIndex];
        jurado = jurados[juradoKey];
    } while (sortedJurados.hasOwnProperty(juradoKey) || substitutedJurados.hasOwnProperty(juradoKey));

    //let numeroJurado = jurado[0];

    //TODO: put this logic int the 'confirmJuradoSubstitution' function
    /*
    sortedJurados.push(juradoKey);

    if (tipoJurado === "titular") {
        juradosTitulares[juradoKey] = jurado;
    }

    if (tipoJurado === "suplente") {
        juradosSuplentes[juradoKey] = jurado;
    }

*/

console.log(`Sorteado jurado: [${juradoKey} , ${jurado.nome}]`);    
return [juradoKey, jurado];
};

/**
 * 
 * @param {number} listCounter - number of the jurado being substituted (not the id, but the index in the sorted html list)
 * @param {Object<string, Object>} sortedJurados - object that stores sorted jurados
 * @param {Object<number, Object>} juradosSubstituidos - object that stores substituted jurados
 * @param {[number, Object]} juradoSubstituido - tuple representing the jurado to be substituted
 * @param {[number, Object]} juradoSubstituto - tuple representing the jurado that will substitute
 * @param {String} tipoJurado - type of jurado, either 'titular' or 'suplente'
 * @returns {{ListCounter: number, juradoSubstituto: Object}} - object containing the number of the position in the sorted html list and the jurado that will substitute the other
 * @param {Object<string, Object>} juradosTitulares - object that stores jurados titulares
 * @param {Object<string, Object>} juradosSuplentes - object that stores jurados suplentes
 * @param {string} motivo - reason for the substitution
 */
export function substituteJurados(
    listCounter,
    sortedJurados,
    juradosSubstituidos,
    juradoSubstituido,
    juradoSubstituto,
    tipoJurado,
    juradosTitulares,
    juradosSuplentes,
    motivo
) {

    const juradoSubstituidoKey = juradoSubstituido[0];
    const juradoSubstitutoKey = juradoSubstituto[0];

    console.log(`Substituindo jurado: [${juradoSubstituidoKey} , ${juradoSubstituido[1].nome}] por [${juradoSubstitutoKey} , ${juradoSubstituto[1].nome}]`);
    console.log(`Jurado substituto: ${juradoSubstituto}`)

    juradosSubstituidos[juradoSubstituidoKey] = juradoSubstituido[1];
    
    //Include the sorted jurado in the sortedJurados object
    //And remove the jurado substituido from the sortedJurados, juradosTitulares and juradosSuplentes objects
    sortedJurados[juradoSubstitutoKey] = juradoSubstituto[1];
    delete sortedJurados[juradoSubstituidoKey];


    if (tipoJurado === 'titular') {
        juradosTitulares[juradoSubstitutoKey] = juradoSubstituto[1];
        delete juradosTitulares[juradoSubstituidoKey];
    }

    if (tipoJurado === 'suplente') {
        juradosSuplentes[juradoSubstitutoKey] = juradoSubstituto[1];
        delete juradosSuplentes[juradoSubstituidoKey];
    }

    const substituicao = new Substituicao(
        juradoSubstituido[1],
        juradoSubstituto[1],
        motivo
    )

    //Adds the substitution to the appState object
    appState.substituicoes.push(substituicao);

    return {
        listCounter: listCounter,
        juradoSubstituto: juradoSubstituto[1],
    }
}