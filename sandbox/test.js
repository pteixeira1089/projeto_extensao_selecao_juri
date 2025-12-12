import { ParticipantesForm } from "../view/ParticipantesForm.js";

const participantesForm = new ParticipantesForm();

document.getElementById('content').appendChild(participantesForm.render());