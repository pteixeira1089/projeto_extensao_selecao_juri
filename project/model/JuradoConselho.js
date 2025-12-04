import { JuradoSorteado } from "./JuradoSorteado";
import { ConselhoStatus } from "./enums/ConselhoStatus";
import { JuradoStatus } from "./enums/JuradoStatus";

export class JuradoConselho extends JuradoSorteado {
    statusConselho;
    
    /**
     * @param { object } props - object containing a JuradoSorteado and a string representing the status of the JuradoConselho
     * @param { JuradoSorteado } props.juradoSorteado - Jurado Sorteado used to instantiate a new object of JuradoConselho
     * @param { string } props.conselhoStatus
     */
    constructor({juradoSorteado, conselhoStatus = ConselhoStatus.NAO_ANALISADO} = {}){
        super(juradoSorteado, juradoSorteado.tipoJurado, juradoSorteado.status);

        if (!Object.values(ConselhoStatus).includes(conselhoStatus)){
            throw new Error(`[JuradoConselho constructor] Argumento conselhoStatus inválido. Use ${Object.values(ConselhoStatus).join(' ou ')}`);
        }
        this.statusConselho = conselhoStatus;
    }

    /**
     * Set the status of the counsel juror, that has to be one between the ConselhoStatus class
     * @param {string} newStatus - status to be setted to the conselhoStatus attribute
     */
    setDisplayStatus(newStatus){
        if (!Object.values(ConselhoStatus).includes(newStatus)){
            throw new Error(`[JuradoConselho constructor] Argumento conselhoStatus inválido. Use ${Object.values(ConselhoStatus).join(' ou ')}`);
        }
        this.statusConselho = newStatus;
    }

    /**
     * Retorna o status a ser exibidos em componentes que renderizam este jurado
     * @returns { string | null}
     */
    getDisplayStatus(){
        return this.statusConselho;
    }
}