import { DropdownInputWithType } from "../view/DropdownInputWithType.js";

const tipos = [
    'Magistrado(a) presidente', 
    'Magistrado(a)', 
    'Membro do MP', 
    'Assistente de acusação', 
    'Representante da OAB', 
    'Defensor(a) constituído', 
    'Defensor(a) Público(a)'
];

const dropdownInput = new DropdownInputWithType('Selecione o tipo de participante', tipos);

document.getElementById('content').appendChild(dropdownInput.getElement());