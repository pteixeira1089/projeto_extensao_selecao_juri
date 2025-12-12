Agora o mapa de fluxo detalhado.

Upload da planilha (entrada)
Onde: botão na tela inicial em script.js (função uploadExcel() chamada quando usuário clica).
Código responsável: functions.js (implementação do reader) — também há uma cópia/variante em script.js.
O que acontece:
O usuário seleciona um arquivo .xlsx/.xls.
Um FileReader lê o arquivo como ArrayBuffer.
Usa-se XLSX (biblioteca) para converter a primeira aba para JSON (linha por linha), XLSX.utils.sheet_to_json(sheet, { header: 1 }).
findColumnIndices(headerRow) tenta localizar colunas obrigatórias (id, nome, nomesocial, genero, cpf, email, endereco, escolaridade, profissao, nascimento).
Se encontradas, extractJuradosData (ou extractJuradosData/extractJuradosData variante) percorre as linhas e instancia objetos Jurado (classe em jurado.js) e retorna um objeto jurados indexado por id: jurados[id] = new Jurado(...).
Formato resultante:
jurados: Object cuja chave é o id (string/number), valor é instância de Jurado: { "<id>": Jurado { id, nome, nomeSocial, genero, rg, cpf, email, endereco, escolaridade, profissao, nascimento }, ... }
Observações:
No functions.js original havia um bug: findColumnIndices lista requiredColumns diferentes entre arquivos; a versão usada no script.js é completa e cria instâncias Jurado.
O parse exige todas as colunas obrigatórias — se faltar, o upload é rejeitado.
Exibição e confirmação da lista de alistados
Onde: script.js, tela de screenControl == 1.
O que acontece:
A aplicação salva o objeto retornado do upload na variável global jurados (no script.js — não confundir com appState).
Gera uma lista visual chamando generateList(jurados) (lista numerada).
Usuário confirma e avança para configuração do sorteio (screenControl 2).
Mutação de estado:
jurados (variável local no script) passa a conter todos os alistados; appState ainda não é atualizado com isso neste ponto (apenas GenerateAtaService escreve em appState mais tarde).
Observação: existe também appState.juradosTitularesData e appState.juradosSuplentesData no appState.js como valores mock — mas os dados reais só são gravados em appState no momento da geração da ata (GenerateAtaService).
Configuração do sorteio
Onde: script.js, screenControl == 2
O que o usuário preenche:
nomeJuri (nome do juri/companhia)
formaSorteio (modo: allAtOnce ou onePerClick)
quantidadeJuradosTitulares, quantidadeJuradosSuplentes
Esses valores são armazenados em variáveis do script: nomeJuri, formaSorteio, quantidadeJuradosTitulares, quantidadeJuradosSuplentes.
Não há gravação imediata em appState, apenas variáveis do fluxo.
Sorteio (algoritmo)
Onde: script.js (muita lógica aqui) e JuradoSubstitution.js para substituições aleatórias.
Principais estruturas runtime:
sortedJurados: object que armazena os jurados já sorteados { id: jurado, ... }.
juradosTitulares: object com os titulares sorteados.
juradosSuplentes: object com suplentes sorteados.
juradosSubstituidos: object com jurados que foram substituídos.
totalJuradosAlistados: número de chaves em jurados (definido quando a planilha foi carregada).
Modo "allAtOnce":
Loopa: chama sortearJurado(tipo) até preencher titulares e suplentes desejados.
sortearJurado seleciona uma chave aleatória entre Object.keys(jurados) até encontrar uma que ainda não esteja em sortedJurados.
Insere no sortedJurados e em juradosTitulares ou juradosSuplentes conforme tipo.
Depois, listas são renderizadas (função addJuradoToList monta elementos HTML).
Modo "onePerClick":
A cada clique no botão "Sortear próximo jurado", chama sortearJurado e insere o nome no DOM; quando termina, converte para allAtOnce e habilita a homologação.
Importante: as listas no DOM mantêm botões "Substituir" para cada item.
Substituições (quando o usuário pede)
Onde: JuradoSubstitution.js + SubstituicaoForm.js (formulário) + script.js integração.
Fluxo:
Ao clicar em "Substituir" no item da lista, o SubstituicaoForm é criado (instanciado) com:
jurado a ser substituído (tuple [key, juradoObject])
novo jurado retornado por sortJuradoSubstitution(...) (que garante não escolher alguém já sorteado ou substituído)
referências a objetos (sortedJurados, juradosSubstituidos, juradosTitulares, juradosSuplentes) necessários para atualizar os mapas
O formulário (UI) pergunta motivo e confirma substituição.
Ao confirmar, substituteJurados(...) é chamado:
Remove o jurado antigo do sortedJurados e dos mapas de titulares/suplentes.
Adiciona o jurado substituto (novo) nas mesmas estruturas.
Cria um objeto Substituicao (classe em substituicao.js) e faz appState.substituicoes.push(substituicao).
Ou seja: substituições são registradas diretamente em appState.substituicoes no momento da confirmação.
Observação: Substituicao carrega referências aos objetos Jurado (antes e depois) e um motivo.
Homologação do sorteio e geração da ata
Onde: botão em script.js (quando formaSorteio != 'onePerClick' e usuário clica em "Homologar sorteio: gerar relatório de jurados").
Ação:
O código consolida os jurados sorteadose nas variáveis locais:
sortedJurados, juradosTitulares, juradosSuplentes, juradosSubstituidos.
Antes de navegar para a página da ata, chama: GenerateAtaService.generateAta( Object.values(juradosTitulares), Object.values(juradosSuplentes), appState.substituicoes, () => { screenControl = 5; loadScreen(); } )
GenerateAtaService.generateAta escreve em appState:
appState.juradosTitularesData = juradosTitulares (array de Jurado)
appState.juradosSuplentesData = juradosSuplentes (array de Jurado)
appState.substituicoes = substituicoes (array de Substituicao)
Depois chama callback para ir para screenControl == 5, que é a tela da ATA.
Composição e renderização da ATA final
Onde: script.js para criar PageComposer + componentes em project/view/AtaSorteioJurados/*.
O PageComposer é instanciado com document.getElementById('content') e componentes são criados e adicionados em ordem:
CabecalhoAtaSorteioJurados() — apenas exibe título/data.
PresencasAtaSorteioJurados(appState.participantesData) — consome appState.participantesData (participantes presentes preenchidos em screenControl == 3 via ParticipantesForm).
BodyAtaSorteioJurados(texto) — parágrafo introdutório.
ListagemSorteadosAtaSorteioJurados(appState.juradosTitularesData, 'TITULARES') — cria lista baseada em appState.juradosTitularesData.
ListagemSorteadosAtaSorteioJurados(appState.juradosSuplentesData, 'SUPLENTES') — idem para suplentes.
SubstituicoesAtaSorteioJurados(appState.substituicoes) — lista substituições registradas (appState.substituicoes foi populado durante substitutes).
BodyAtaSorteioJurados('NADA MAIS...') — encerramento.
SigningLineAtaSorteioJurados() — imprime assinante (appState.signer ou default).
Cada componente tem método create() que gera um DOM element; PageComposer.addComponent chama create() e anexa ao ponto de inserção.
Persistência / saída
Atualmente os dados da ata são renderizados no DOM para visualização/impressão. Não há evidência de que a aplicação salva um PDF automaticamente (existem comentários sobre criação de printArea e window.print()).
A geração de cookies está comentada; há função generateCookies mas não é chamada no fluxo principal (comentada).
Resumo dos pontos onde os dados são mutados (appState e variáveis)

appState (arquivo appState.js) é utilizado como "store" global.
Valores iniciais mock: participantesData, juradosTitularesData, juradosSuplentesData, substituicoes, signer.
Mutations ocorrendo:
Durante substituição confirmada: appState.substituicoes.push(substituicao) (em JuradoSubstitution.js).
Na homologação (GenerateAtaService.generateAta): escreve appState.juradosTitularesData, appState.juradosSuplentesData, appState.substituicoes.
appState.participantesData é populado através de ParticipantesForm (instanciado e salvo em appState.participantesForm e também retorna/atualiza appState.participantesData — vi código que instancia o form e armazena no appState; o preenchimento exato é manipulado pelo ParticipantesForm em ParticipantesForm.js — eu li o uso, mas não o conteúdo detalhado; ele passa os dados ao PresencasAtaSorteioJurados).
Variáveis locais no script.js (não persistidas em appState, a menos que GenerateAtaService seja chamada):
jurados (objeto de todos os jurados alistados).
sortedJurados, juradosTitulares, juradosSuplentes, juradosSubstituidos (objetos de trabalho para o sorteio).
nomeJuri, formaSorteio, quantidadeJuradosTitulares, quantidadeJuradosSuplentes.
Eventos do usuário que acionam transições

Clicar em "Já possuo a planilha..." → abre file input → parse → preenche jurados local → screenControl=1.
Clicar "Tudo certo: prosseguir..." → screenControl=2.
Configurar e clicar "prosseguir p/ sorteio" → salva nomeJuri/formaSorteio/quantidades e screenControl++.
Em tela de sorteio:
Modo allAtOnce: gera todos os jurados e habilita botão "Homologar sorteio".
Modo onePerClick: sorteia um a um até completar e então habilita homologação.
Clicar "Substituir" em um item → abre SubstituicaoForm → confirmar substituição chama substituteJurados e registra substituição em appState.
Clicar "Homologar sorteio" → chama GenerateAtaService.generateAta(...) → escreve em appState e muda para screenControl=5 (tela da ata).
Tela da ata: PageComposer monta os componentes usando appState.* e exibe.
Formatos de dados (contratos rápidos)

Jurado (model/jurado.js)
{ id, nome, nomeSocial, genero, rg, cpf, email, endereco, escolaridade, profissao, nascimento }
Substituicao (model/substituicao.js)
{ juradoSubstituido: Jurado, juradoSubstituto: Jurado, motivo: string }
Participante (model/participante.js)
{ id, nome, tipo, cargo, matricula }
appState (project/appState.js) — campos relevantes:
screenControl: number
participantesData: array de Participante
juradosTitularesData: array de Jurado (preenchido por GenerateAtaService)
juradosSuplentesData: array de Jurado (preenchido por GenerateAtaService)
substituicoes: array de Substituicao (mutado por substituteJurados e também regravado por GenerateAtaService)
signer: { nome, cargo, matricula }
Casos de borda e observações

Falta de colunas na planilha → upload rejeitado. Bom: validação existe; ruim: mensagens genéricas.
Tipos/IDs duplicados na planilha → jurados é um objeto indexado por id; chaves duplicadas vão sobrescrever — isso não é tratado.
O parse exige todas as colunas obrigatórias; algumas colunas listadas em uma versão do functions.js (ex: obrigatoriedade do CPF) podem variar — verifique consistência entre functions.js e script.js.
A persistência é só em memória (appState); se o usuário recarregar a página, perde tudo. Há código de cookie comentado — talvez previsto para persistência futura.
Substituição: appState.substituicoes recebe push diretamente; mas GenerateAtaService também recebe appState.substituicoes como argumento — duplicidade possível se não for bem sincronizada.
A ordem em que GenerateAtaService recebe juradosTitulares e juradosSuplentes é com Object.values(...) no script.js — isso transforma o objeto em array mas não garante ordenação previsível (o ordenamento é de inserção no objeto; está ok na prática, mas se for crítico, transforme em arrays com índices que representem a ordem de sorteio).
O componente ListagemSorteadosAtaSorteioJurados assume que recebe um array (ex.: appState.juradosTitularesData) — GenerateAtaService o fornece como array (Object.values) — ok.
Recomendações rápidas (baixo risco / mudanças pequenas)

Persistência mínima: gravar o appState essencial (jurados, sortedJurados, juradosTitularesData, juradosSuplentesData, substituicoes) em localStorage ao homologar, para evitar perda por reload.
Ordenação explícita: em vez de usar Object.values, mantenha arrays em sortedJurados quando a ordem de sorteio for importante.
Tratamento de duplicatas: validar ids únicos na planilha e mostrar aviso/erros com linha/registro.
Mensagens de erro melhores e passos instruídos para o usuário (ex: qual coluna faltou).
Testes unitários básicos para sortearJurado, sortJuradoSubstitution e substituteJurados (lógica determinística se mockar RNG).
Quando gerar a ata para impressão, criar uma função que transforma os componentes em HTML pronto para impressão/PDF e exporte como PDF se desejado (biblioteca jsPDF/html2pdf).
Cobertura de requisitos (seu pedido)

Você pediu o fluxo de informações desde a planilha importada até a ata final: Done — expliquei passo-a-passo destacando arquivos e lugares onde os dados são processados.
Você pediu para entender como os dados trafegam pelos componentes já criados: Done — destaquei como appState e variáveis locais interagem com os componentes em view/AtaSorteioJurados e onde GenerateAtaService grava em appState.
Próximos passos (posso fazer um ou mais conforme preferir)

Gerar um diagrama simples (texto ASCII ou imagem) mostrando o fluxo (upload → jurados local → sorteio → substituições → GenerateAtaService → appState → PageComposer → components). Posso criar um arquivo README ou documento no repo com esse diagrama.
Implementar persistência em localStorage na homologação para evitar perda dos dados.
Melhorar a validação do upload (mensagens detalhadas e checagem de IDs duplicados).
Adicionar testes unitários para as funções de sorteio/substituição.
Se quiser, leio e explico em detalhe arquivos adicionais (ParticipantesForm.js, SubstituicaoForm.js) para explicar exatamente como participantesData e o formulário de substituição preenchem appState.
Diga qual desses próximos passos prefere que eu faça agora (diagrama textual README / persistência localStorage / validação upload / testes). Se quiser, começo por criar um README com o diagrama e um checklist dos pontos de melhoria.
