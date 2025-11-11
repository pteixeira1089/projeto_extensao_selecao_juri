import { juradosSuplentesMock } from "./mockJuradosSorteados.js";
import { JuradoStatus } from "../../model/JuradoStatus.js";

/**
 * Mock data for reserve suplentes.
 * These are the suplentes who were not needed to form the initial quorum.
 * All have the status 'SUPLENTE_RESERVA'.
 * @type {import("../../model/JuradoSorteado.js").JuradoSorteado[]}
 */
export const suplentesReservaMock = juradosSuplentesMock.slice(5).map(jurado => ({
    ...jurado,
    status: JuradoStatus.SUPLENTE_RESERVA
}));