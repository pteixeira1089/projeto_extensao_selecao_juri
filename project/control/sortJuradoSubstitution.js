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

    return [juradoKey, jurado];
}