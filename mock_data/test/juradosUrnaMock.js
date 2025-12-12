import { juradosTitularesMock } from "./mockJuradosTitulares.js";
import { juradosSuplentesMock } from "./mockJuradosSorteados.js";
import { JuradoStatus } from "../../model/enums/JuradoStatus.js";
import { JuradoConselho } from "../../model/JuradoConselho.js"
import { ConselhoStatus } from "../../model/enums/ConselhoStatus.js";

// Pega os 10 primeiros jurados titulares
const titularesParaUrna = juradosTitularesMock.slice(0, 10).map(jurado => {
    const juradoConselho = new JuradoConselho({ juradoSorteado: jurado, conselhoStatus: ConselhoStatus.NAO_SORTEADO });
    juradoConselho.setStatus(JuradoStatus.APTO); // Define o status como APTO
    return juradoConselho;
});

// Pega os 5 primeiros jurados suplentes
const suplentesParaUrna = juradosSuplentesMock.slice(0, 5).map(jurado => {
    const juradoConselho = new JuradoConselho({ juradoSorteado: jurado, conselhoStatus: ConselhoStatus.NAO_SORTEADO });
    juradoConselho.setStatus(JuradoStatus.APTO); // Define o status como APTO
    return juradoConselho;
});

/**
 * Mock data for jurors inside the ballot box (urna).
 * Composed of 10 titular jurors and 5 suplente jurors, all with 'APTO' status.
 * @type {import("../../model/JuradoSorteado.js").JuradoSorteado[]}
 */
export const juradosUrnaMock = [...titularesParaUrna, ...suplentesParaUrna];