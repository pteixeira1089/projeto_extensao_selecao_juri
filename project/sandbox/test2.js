import { PageComposer } from '../control/PageComposer.js';
import { CabecalhoAtaSorteioJurados } from '../view/AtaSorteioJurados/CabecalhoAtaSorteioJurados.js';
import { PresencasAtaSorteioJurados } from '../view/AtaSorteioJurados/PresencasAtaSorteioJurados.js';
import { appState } from '../appState.js';
import { BodyAtaSorteioJurados } from '../view/AtaSorteioJurados/BodyAtaSorteioJurados.js';

// In your main application script
const pageComposer = new PageComposer(document.getElementById('content'));
const cabecalho = new CabecalhoAtaSorteioJurados();
const presencas = new PresencasAtaSorteioJurados(appState.presencas);
const bodyParagraph = new BodyAtaSorteioJurados();


pageComposer.addComponent(cabecalho);
pageComposer.addComponent(presencas);
pageComposer.addComponent(bodyParagraph);