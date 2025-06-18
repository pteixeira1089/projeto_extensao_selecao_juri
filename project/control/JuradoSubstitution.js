/**
 * 
 * @param {string[]} sortedJurados - lista de chaves de jurados já sorteados
 * @param {number} totalJuradosAlistados - total de jurados selecionados para sorteio
 * @param {Object<string, Object>} jurados - coleção de jurados
 * @returns {[string, Object] | null} - par string, jurado, representando o jurado sorteado e seu id
 */

export function sortJuradoSubstitution(
    sortedJurados,
    totalJuradosAlistados,
    jurados
) {
    if (sortedJurados.length >= totalJuradosAlistados) {
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
    } while (sortedJurados.includes(juradoKey));

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
 * @param {number[]} sortedJurados - array that stores sorted jurados keys
 * @param {Object<number, Object>} juradosSubstituidos - object that stores substituted jurados
 * @param {[number, Object]} juradoSubstituido - tuple representing the jurado to be substituted
 * @param {[number, Object]} juradoSubstituto - tuple representing the jurado that will substitute
 * @param {String} tipoJurado - type of jurado, either 'titular' or 'suplente'
 * @returns {{ListCounter: number, juradoSubstituto: Object}} - object containing the number of the position in the sorted html list and the jurado that will substitute the other
 * @param {Object<string, Object>} juradosTitulares - object that stores jurados titulares
 * @param {Object<string, Object>} juradosSuplentes - object that stores jurados suplentes
 */
export function substituteJurados(
    listCounter,
    sortedJurados,
    juradosSubstituidos,
    juradoSubstituido,
    juradoSubstituto,
    tipoJurado,
    juradosTitulares,
    juradosSuplentes
) {

    const juradoSubstituidoKey = juradoSubstituido[0];
    const juradoSubstitutoKey = juradoSubstituto[0];

    console.log(`Substituindo jurado: [${juradoSubstituidoKey} , ${juradoSubstituido[1].nome}] por [${juradoSubstitutoKey} , ${juradoSubstituto[1].nome}]`);

    juradosSubstituidos[juradoSubstituidoKey] = juradoSubstituido[1];
    
    //Include the sorted jurado in the sorted arrays and objects
    //And remove the jurado substituido from the sorted arrays and objects
    sortedJurados.push(juradoSubstitutoKey);
    sortedJurados = sortedJurados.filter(item => item != juradoSubstituidoKey)


    if (tipoJurado === 'titular') {
        juradosTitulares[juradoSubstitutoKey] = juradoSubstituto[1];
        delete juradosTitulares[juradoSubstituidoKey];
    }

    if (tipoJurado === 'suplente') {
        juradosSuplentes[juradoSubstitutoKey] = juradoSubstituto[1];
        delete juradosSuplentes[juradoSubstituidoKey];
    }

    return {
        listCounter: listCounter,
        juradoSubstituto: juradoSubstituto[1]
    }


}