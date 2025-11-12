import { juradosSuplentesMock } from "./mockJuradosSorteados.js";
import { JuradoStatus } from "../../model/JuradoStatus.js";
import { JuradoConselho } from "../../model/JuradoConselho.js"
import { ConselhoStatus } from "../../model/ConselhoStatus.js";

/**
 * Mock data for reserve suplentes.
 * These are the suplentes who were not needed to form the initial quorum.
 * All have the status 'SUPLENTE_RESERVA'.
 * @type {import("../../model/JuradoSorteado.js").JuradoSorteado[]}
 */
export const suplentesReservaMock = juradosSuplentesMock.slice(5).map(jurado => {
    const suplenteReserva = new JuradoConselho({juradoSorteado: jurado, conselhoStatus: ConselhoStatus.SUPLENTE_NAO_CONVOCADO});
    suplenteReserva.setStatus(JuradoStatus.SUPLENTE_RESERVA);
    return suplenteReserva;
});