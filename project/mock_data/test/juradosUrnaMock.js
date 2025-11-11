import { juradosTitularesMock } from "./mockJuradosTitulares.js";
import { juradosSuplentesMock } from "./mockJuradosSorteados.js";
import { JuradoStatus } from "../../model/JuradoStatus.js";

// Pega os 10 primeiros jurados titulares
const titularesParaUrna = juradosTitularesMock.slice(0, 10).map(jurado => ({
    ...jurado,
    status: JuradoStatus.APTO
}));

// Pega os 5 primeiros jurados suplentes
const suplentesParaUrna = juradosSuplentesMock.slice(0, 5).map(jurado => ({
    ...jurado,
    status: JuradoStatus.APTO
}));

/**
 * Mock data for jurors inside the ballot box (urna).
 * Composed of 10 titular jurors and 5 suplente jurors, all with 'APTO' status.
 * @type {import("../../model/JuradoSorteado.js").JuradoSorteado[]}
 */
export const juradosUrnaMock = [...titularesParaUrna, ...suplentesParaUrna];