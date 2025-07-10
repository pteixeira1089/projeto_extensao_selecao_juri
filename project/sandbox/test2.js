import { PageComposer } from '../control/PageComposer.js';
import { CabecalhoAtaSorteioJurados } from '../view/AtaSorteioJurados/CabecalhoAtaSorteioJurados.js';
import { PresencasAtaSorteioJurados } from '../view/AtaSorteioJurados/PresencasAtaSorteioJurados.js';
import { appState } from '../appState.js';
import { BodyAtaSorteioJurados } from '../view/AtaSorteioJurados/BodyAtaSorteioJurados.js';
import { ListagemSorteadosAtaSorteioJurados } from '../view/AtaSorteioJurados/ListagemSorteadosAtaSorteioJurados.js';
import { SigningLineAtaSorteioJurados } from '../view/AtaSorteioJurados/SigningLineAtaSorteioJurados.js';

const pageComposer = new PageComposer(document.getElementById('content'));
const cabecalho = new CabecalhoAtaSorteioJurados();
const presencas = new PresencasAtaSorteioJurados(appState.presencas);
const bodyParagraph = new BodyAtaSorteioJurados(`Com as formalidades de praxe, o(a) MM. Juiz(a) Federal procedeu ao sorteio dos jurados aptos a atuarem na sessão periódica do júri, sendo sorteados os seguintes nomes, os quais serão convocados para comparecerem no dia e horário designados:`);
const juradosTitulares = new ListagemSorteadosAtaSorteioJurados(appState.juradosTitularesData, 'TITULARES');
const juradosSuplentes = new ListagemSorteadosAtaSorteioJurados(appState.juradosSuplentesData, 'SUPLENTES');
const bodyEnding = new BodyAtaSorteioJurados(`NADA MAIS. Lida e achada conforme, vai devidamente assinada.`);
const assinatura = new SigningLineAtaSorteioJurados();


pageComposer.addComponent(cabecalho);
pageComposer.addComponent(presencas);
pageComposer.addComponent(bodyParagraph);
pageComposer.addComponent(juradosTitulares);
pageComposer.addComponent(juradosSuplentes);
pageComposer.addComponent(bodyEnding);
pageComposer.addComponent(assinatura);