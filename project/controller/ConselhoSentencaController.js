import { AppState, appState } from "../appState.js";
import { CedulaDescartada } from "../model/CedulaDescartada.js";
import { SelectedListPossibleValues } from "../model/enums/AppStateConstants.js";
import { ConselhoStatus } from "../model/enums/ConselhoStatus.js";
import { ConstantesCPP } from "../model/enums/ConstantesCPP.js";
import { JuradoConselho } from "../model/JuradoConselho.js";
import { ConselhoSorteioService } from "../service/ConselhoSorteioService.js"
import { ModalService } from "../service/ModalService.js";

export class ConselhoSentencaController {

    /**
     * @type { AppState }
     */
    appState;

    /**
     * @param {AppState} appStateInstance - A instância do estado da aplicação.
     */
    constructor(appStateInstance = appState) {
        this.appState = appStateInstance;
    }

    onUrna() {
        if (this.appState.selectedList === SelectedListPossibleValues.URNA || !this.appState.selectedList) {
            //Debugging
            console.log(`[controller] O valor de lista selecionada já aponta para Urna ou é vazio`)
            return;
        }

        const listaPresenca = this.appState.listObject;
        //Debugging
        console.log(`[controller] list object registrado no appState:`);
        console.log(listaPresenca);
        console.log(`[controller] Executando método para alternar listas`)

        //Alternate items in frontend
        listaPresenca.alternateItems();

        //Changes the state
        this.appState.selectedList = SelectedListPossibleValues.URNA;
        this.appState.changeSelectedArray();

        //Debugging
        console.log(`[controller] Lista alternada`);
    }

    onSuplentes() {
        if (this.appState.selectedList === SelectedListPossibleValues.SUPLENTES_RESERVA || !this.appState.selectedList) {
            //Debugging
            console.log(`[controller] O valor de lista selecionada já aponta para Suplentes Reserva ou é vazio`)
            return;
        }

        const listaPresenca = this.appState.listObject;
        //Debugging
        console.log(`[controller] list object registrado no appState:`);
        console.log(listaPresenca);
        console.log(`[controller] Executando método para alternar listas`)

        //Alternate items in frontend
        listaPresenca.alternateItems();

        //Changes the state
        this.appState.selectedList = SelectedListPossibleValues.SUPLENTES_RESERVA;
        this.appState.changeSelectedArray();

        //Debugging
        console.log(`[controller] Lista alternada`);
    }

    async onSortearJurado() { // 1. Garante que o método é assíncrono
        /**@type {JuradoConselho} */
        const juradoSelecionado = appState.juradoSelecionado;

        // Verifica se há um jurado selecionado e se ele ainda não foi categorizado
        if (juradoSelecionado && !ConselhoSorteioService.isConselhoJurorCategorized(juradoSelecionado)) {

            // Exibe o primeiro modal, perguntando se deseja descartar a cédula
            const querDescartar = await ModalService.confirm({
                title: "Categorização pendente",
                message: `Não é possível sortear um novo jurado enquanto o jurado atual não for categorizado.
                Caso o Juízo entenda que esta cédula não deveria estar na urna, por algum motivo de impedimento não identificado nas etapas anteriores, clique em "Descartar cédula", no botão abaixo. Caso contrário, clique em "Voltar (categorizar jurado)" para categorizar o jurado como recusado por uma das partes ou para confirmá-lo como membro do conselho de sentença, nos termos do CPP.`,
                confirmButtonText: "Descartar cédula",
                cancelButtonText: "Voltar (categorizar jurado)"
            });

            // Se o usuário clicou em "Descartar cédula", `querDescartar` será `true`
            if (querDescartar) {
                // Exibe o segundo modal, pedindo a justificativa
                let justificativa = ""; // Inicializa como string vazia

                while (true) { // Loop infinito que controlaremos internamente
                    justificativa = await ModalService.confirmWithInput({
                        title: "Justificar Descarte",
                        message: "Por favor, informe o motivo para o descarte da cédula do jurado:",
                        confirmButtonText: "Confirmar Descarte"
                    });

                    // Cenário 1: Usuário cancelou o modal de justificativa.
                    if (justificativa === false) {
                        console.log("[Controller] Descarte cancelado pelo usuário no modal de justificativa.");
                        return; // Sai completamente da função onSortearJurado
                    }

                    // Cenário 2: Usuário confirmou, mas deixou o campo em branco.
                    if (justificativa.trim() === "") {
                        await ModalService.message({ title: "Atenção", message: "A justificativa é obrigatória para o descarte." });
                        // O loop continuará, mostrando o modal de input novamente.
                    } else {
                        // Cenário 3: Usuário forneceu uma justificativa válida.
                        break; // Sai do loop.
                    }
                }

                // Se chegamos aqui, temos uma justificativa válida.
                console.log(`[ConselhoSentencaController] Descartando jurado ${juradoSelecionado.nome} pelo motivo: ${justificativa}`);

                //Altera o statusConselho do jurado selecionado
                juradoSelecionado.setDisplayStatus(ConselhoStatus.CEDULA_DESCARTADA);

                //Constrói um objeto CedulaDescartada com os dados coletados
                const cedulaDescartada = new CedulaDescartada({
                    juradoConselho: juradoSelecionado,
                    justificativa: justificativa
                });

                //AppState actions:

                //1. Limpa o jurado selecionado                
                this.appState.clearJuradoSelecionado();

                //2. Descarta a cédula, no nível do estado da aplicação
                this.appState.discardBallotCell(cedulaDescartada); //Isso chama o renderer da página (cards e lista), que perceberá que não há jurado selecionado

                //DEBUGGING
                console.log('[ConselhoSentencaController] Cédulas descartadas:');
                appState.cedulasDescartadas.forEach((cedula) => console.log(cedula));

                return;
            }
        }

        //From this point on: there is no jurado selected in appState.juradoSelecionado
        const urnaJurors = this.appState.juradosUrna;
        const suplentesReserva = this.appState.suplentesRemanescentes;
        const areAvailableTitularJurorsToSort = ConselhoSorteioService.areAllUrnaJurorsSorted(urnaJurors);

        if (this.appState.selectedList === SelectedListPossibleValues.URNA) {


            if (!areAvailableTitularJurorsToSort) {
                const propsModal = {
                    title: "Não há jurados titulares disponíveis",
                    message: "Não há mais jurados titulares disponíveis para sorteio. Convoque suplentes alternando para a lista de suplentes."
                }

                const MessageModal = ModalService.message(propsModal);
                return;
            }

            //From this point forward:
            //The user has the titular juros list selected AND
            //There are available jurors to be sorted
            const availableTitularJurorsToSort = this.appState.juradosUrna.filter(
                (jurado) => {
                    const possibleValues = [ConselhoStatus.NAO_ANALISADO, ConselhoStatus.NAO_SORTEADO, ConselhoStatus.SUPLENTE_NAO_CONVOCADO]
                    return possibleValues.includes(jurado.statusConselho);
                }
            );

            const juradoSorteado = ConselhoSorteioService.sorteiaJurado(availableTitularJurorsToSort);

            //Este método do appState notifica um tópico no qual o renderer de card está inscrito
            appState.setJuradoSelecionado(juradoSorteado);

        } else { //selectedList is suplentes

            //Não permite sortear suplents se ainda há titulares disponíveis para sorteio
            if (areAvailableTitularJurorsToSort) {
                const message = ModalService.message({
                    title: 'Não é possível convocar suplentes',
                    message: 'Ainda há cédulas disponíveis para sorteio na Urna. Selecione a urna e prossiga com o sorteio.'
                })
                return;
            }
        }
    }

    async onRecusaMPF() {
        /** @type { JuradoConselho } */
        const juradoSelecionado = appState.juradoSelecionado;
        const qtdRecusasMPF = appState.juradosRecusadosAcusacao.length;

        if (qtdRecusasMPF >= ConstantesCPP.RECUSAS_MPF) {
            const message = ModalService.message({
                title: "Não há mais recusas disponíveis",
                message: `A acusação não tem mais recusas imotivadas disponíveis. Jurados já recusados: ${appState.juradosRecusadosAcusacao.map(jurado => jurado.nome).join(', ')}`
            })

            return;
        }

        //Caso o MPF ainda tenha recusas disponíveis
        const confirmaRecusa = await ModalService.confirm({
            title: "ATENÇÃO: Registrar recusa imotivada - ACUSAÇÃO",
            message: "Confirmar registro de recusa imotivada para a ACUSAÇÃO? (atenção: esta operação não pode ser desfeita; só prossiga caso a defesa já tenha se manifestado, nos termos do art. 468 do CPP)"
        })

        if (confirmaRecusa) {

            //1. Altera o status do jurado
            juradoSelecionado.setDisplayStatus(ConselhoStatus.SORTEADO_RECUSADO_MP);

            //2. Ajusta o appState
            appState.addRecusaAcusacao(juradoSelecionado);
        }

    }

    async onRecusaDefesa() {
        /** @type { JuradoConselho } */
        const juradoSelecionado = appState.juradoSelecionado;
        const qttRecusasDisponiveisDefesa = appState.qttRecusasImotivadasDisponiveisDefesa;

        if (qttRecusasDisponiveisDefesa <= 0) {
            ModalService.message({
                title: "Não há mais recusas disponíveis",
                message: `A defesa não tem mais recusas imotivadas disponíveis. Jurados já recusados: ${appState.juradosRecusadosDefesa.map(jurado => jurado.nome).join(', ')}`
            })

            return;
        }

        //Caso a defe ainda tenha recusas disponíveis
        const confirmaRecusa = await ModalService.confirm({
            title: "Registrar recusa imotivada - DEFESA",
            message: "Confirmar registro de recusa imotivada para a DEFESA? (atenção: esta operação não pode ser desfeita!)"
        })

        if (confirmaRecusa) {

            //1. Altera o status do jurado
            juradoSelecionado.setDisplayStatus(ConselhoStatus.SORTEADO_RECUSADO_DEFESA);

            //2. Ajusta o appState
            appState.addRecusaDefesa(juradoSelecionado);
        }

    }


}