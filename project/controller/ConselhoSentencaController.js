import { AppState, appState } from "../appState.js";
import { CedulaDescartada } from "../model/CedulaDescartada.js";
import { SelectedListPossibleValues } from "../model/enums/AppStateConstants.js";
import { ConselhoStatus } from "../model/enums/ConselhoStatus.js";
import { ConstantesCPP } from "../model/enums/ConstantesCPP.js";
import { ScreenCallsTests } from "../model/enums/ScreenCalls.js";
import { Topicos } from "../model/enums/Topicos.js";
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
        this.subscriptions = [];
    }

    /**
     * Remove todos os listeners de tópicos que foram criados por esta página.
     * Essencial para evitar memory leaks ao trocar de tela.
     */
    destroy() {
        console.log('[ConselhoSentencaController] Removendo inscrições (subscriptions) da página.');
        this.subscriptions.forEach(({ topic, callback }) => {
            const subscribers = this.appState.subscribers.get(topic);
            if (subscribers) {
                const index = subscribers.indexOf(callback);
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            }
        });
        this.subscriptions = []; // Limpa o array de inscrições
    }

    onUrna() {
        // A única responsabilidade do controller é atualizar o estado.
        // A view irá reagir a essa mudança de estado.
        this.appState.setSelectedList(SelectedListPossibleValues.URNA);
    }

    onSuplentes() {
        // A única responsabilidade do controller é atualizar o estado.
        // A view irá reagir a essa mudança de estado.
        this.appState.setSelectedList(SelectedListPossibleValues.SUPLENTES_RESERVA);
    }

    async onSortearJurado() { // 1. Garante que o método é assíncrono
        /**@type {JuradoConselho} */
        const juradoSelecionado = appState.juradoSelecionado;

        //Verifica se o conselho já está formado
        if (ConselhoSorteioService.isConselhoFormed(appState.juradosConselhoSentenca)) {
            ModalService.message({
                title: 'Conselho formado!',
                message: "O conselho de sentença já está formado. Não é possível sortear mais cédulas. Finalize o procedimento clicando no botão 'Confirmar conselho de sentença.'"
            })
            return;
        }

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
        const areAvailableTitularJurorsToSort = ConselhoSorteioService.areAvailableJurorsToSort(urnaJurors);

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

            //From this point on: there are no more available titulares to sort
            //Selected list is the suplentes list
            const availableSuplentesJurorsToSort = this.appState.suplentesRemanescentes.filter(
                (jurado) => {
                    const possibleValues = [ConselhoStatus.NAO_ANALISADO, ConselhoStatus.NAO_SORTEADO, ConselhoStatus.SUPLENTE_NAO_CONVOCADO]
                    return possibleValues.includes(jurado.statusConselho);
                }
            );

            const juradoSorteado = ConselhoSorteioService.sorteiaJurado(availableSuplentesJurorsToSort);

            //Este método do appState notifica um tópico no qual o renderer de card está inscrito
            appState.setJuradoSelecionado(juradoSorteado);

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

    async onConfirmarJurado() {

        /**
         * @type {JuradoConselho}
         */
        const juradoSelecionado = appState.juradoSelecionado;

        const statusPermitidos = [ConselhoStatus.NAO_ANALISADO, ConselhoStatus.NAO_SORTEADO, ConselhoStatus.SUPLENTE_NAO_CONVOCADO];

        if (ConselhoSorteioService.isConselhoFormed(appState.juradosConselhoSentenca)) {
            console.log('[ConselhoSentencaController] O jurado abaixo não foi adicionado ao conselho de sentença, pois o conselho já está formado');
            console.log(juradoSelecionado);

            ModalService.message({
                title: 'Jurado não adicionado',
                message: 'O Conselho de Sentença já está formado. Não é possível adicionar mais jurados!'
            });
            return;
        }

        if (!statusPermitidos.includes(juradoSelecionado.statusConselho)) {
            console.log('[ConselhoSentencaController] O jurado abaixo não foi adicionado ao conselho de sentença, pois JÁ FOI CATEGORIZADO');
            console.log(juradoSelecionado);

            ModalService.message({
                title: 'Jurado não adicionado',
                message: `Não é possível adicionar o jurado ao conselho de sentença, pois ele já foi analisado com o seguinte status: ${appState.juradoSelecionado.statusConselho}.`
            })
            return;
        }

        //From this point on:
        //conselho de sentença ainda não está formado
        //jurado possui status 'não analisado' (null), 'não sorteado' ou 'suplente reserva'

        const confirmaSorteioJurado = await ModalService.confirm({
            title: "Confirmar jurado sorteado",
            message: "Deseja confirmar o jurado sorteado como integrante do Conselho de Sentença? ATENÇÃO: esta ação não pode ser desfeita",
            confirmButtonText: "Confirmar jurado",
            cancelButtonText: "Cancelar"
        })

        if (confirmaSorteioJurado) {
            juradoSelecionado.setDisplayStatus(ConselhoStatus.SORTEADO_MEMBRO_CONSELHO);

            //Ajustes no estado da aplicação (appState)
            appState.addJuradoConselho(juradoSelecionado);

        }
    }

    async onConfirmarConselho(){
        if (!ConselhoSorteioService.isConselhoFormed(appState.juradosConselhoSentenca)){
            ModalService.message({
                title: "Conselho de sentença não está formado",
                message: `Não é possível concluir o conselho de sentença, pois o quórum de ${ConstantesCPP.QUORUM_CONSELHO} jurados não foi atingido. Sorteie mais jurados ou suplentes. Caso não haja mais candidatos disponíveis, declare o estouro de urna, nos termos do art. 471, c/c o art. 464, ambos do CPC.`
            })
            return;
        }

        // 1. Limpa os componentes e listeners da tela atual.
        this.destroy();

        // 2. Altera o estado da aplicação para renderizar a próxima tela (Relatório Final).
        // O `script.js` está inscrito neste tópico e chamará `loadScreen`, que por sua vez limpa o DOM.
        this.appState.setScreenControl(ScreenCallsTests.RELATORIO_FINAL);
    }


}