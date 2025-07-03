
export class DropdownInputWithType {
/**
 * Component that combines a dropdown for selecting a type and an input field for entering a string value.
 * 
 * @param {string[]} tipos - array of types to be displayed in the dropdown.
 * @param {string} instructionString - Instruction string to be displayed in the input field.
 */

    constructor(instructionString = '', tipos = []) {
    // Criação do container
    this.container = document.createElement('div');
    this.container.className = 'input-group mb-3';

    // Criação do dropdown
    this.dropdownWrapper = document.createElement('div');
    this.dropdownWrapper.className = 'dropdown';

    this.button = document.createElement('button');
    this.button.className = 'btn btn-outline-secondary dropdown-toggle';
    this.button.type = 'button';
    this.button.dataset.bsToggle = 'dropdown';
    this.button.setAttribute('aria-expanded', 'false');
    this.button.textContent = instructionString ? instructionString : 'Selecione o tipo';

    this.menu = document.createElement('ul');
    this.menu.className = 'dropdown-menu';

    tipos.forEach(tipo => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = '#';
      a.textContent = tipo;
      a.addEventListener('click', e => {
        e.preventDefault();
        this.button.textContent = tipo;
        this.hiddenInput.value = tipo;
      });
      li.appendChild(a);
      this.menu.appendChild(li);
    });

    this.dropdownWrapper.appendChild(this.button);
    this.dropdownWrapper.appendChild(this.menu);

    // Campo visível (opcional)
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'form-control';
    this.input.setAttribute('aria-label', 'Nome do participante');

    // Campo oculto para capturar valor do tipo selecionado
    this.hiddenInput = document.createElement('input');
    this.hiddenInput.type = 'hidden';
    this.hiddenInput.name = 'tipoParticipante'; // útil em formulários

    // Montagem final
    this.container.appendChild(this.dropdownWrapper);
    this.container.appendChild(this.input);
    this.container.appendChild(this.hiddenInput);
  }

  getElement() {
    return this.container;
  }

  getSelectedTipo() {
    return this.hiddenInput.value;
  }

  getNomeParticipante() {
    return this.input.value;
  }
}
