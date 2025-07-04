
export class DropdownInputWithType {
  /**
   * Component that combines a dropdown for selecting a type and an input field for entering a string value.
   * 
   * @param {Object} tipos - Object where keys are internal values and values are display strings.
   * @param {string} instructionString - Instruction string to be displayed in the input field.
   * @param {number|null} selectedIndex - Index of the type to be pre-selected in the dropdown.
   */

  constructor(instructionString = '', tipos = {}, selectedIndex = null) {
    // Criação do container
    this.container = document.createElement('div');
    this.container.className = 'input-group mb-3 align-items-stretch';
    this.container.style.marginRight = '30px'; // Espaçamento à direita
    this.container.style.width = '100%'; // Para ocupar o espaço restante
    this.container.style.maxWidth = '800px' // Limite máximo de largura
    this.container.style.margin = '0 auto'; // Centralizar horizontalmente

    // Criação do dropdown
    this.dropdownWrapper = document.createElement('div');
    this.dropdownWrapper.className = 'dropdown';
    this.dropdownWrapper.style.flex = '1'; // Para ocupar o espaço restante

    this.button = document.createElement('button');
    this.button.className = 'btn btn-outline-secondary dropdown-toggle w-100';
    this.button.type = 'button';
    this.button.dataset.bsToggle = 'dropdown';
    this.button.setAttribute('aria-expanded', 'false');

    this.menu = document.createElement('ul');
    this.menu.className = 'dropdown-menu';

    //Para garantir ordenação estável
    const entries = Object.entries(tipos);

    // Campo oculto para capturar valor do tipo selecionado
    this.hiddenInput = document.createElement('input');
    this.hiddenInput.type = 'hidden';
    this.hiddenInput.name = 'tipoParticipante'; // útil em formulários

    // Determinar valor inicial do botão e hidden input
    if (typeof selectedIndex === 'number' && entries[selectedIndex] !== undefined) {
      console.log(`Selected index: ${selectedIndex}, Type: ${entries[selectedIndex]}`);
      const [key, label] = entries[selectedIndex];
      this.button.textContent = label
      this.hiddenInput.value = key;
    } else {
      console.log(`No valid selected index provided, using instruction string: ${instructionString}`);
      this.button.textContent = instructionString ? instructionString : 'Selecione o tipo';
      this.hiddenInput.value = '';
    }

    entries.forEach(([key, label]) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = '#';
      a.textContent = label;
      a.addEventListener('click', e => {
        e.preventDefault();
        this.button.textContent = label;
        this.hiddenInput.value = key;
      });
      li.appendChild(a);
      this.menu.appendChild(li);
    });

    this.dropdownWrapper.appendChild(this.button);
    this.dropdownWrapper.appendChild(this.menu);

    // Campo visível (opcional)
    this.inputWrapper = document.createElement('div');
    this.inputWrapper.className = 'input-wrapper d-flex align-items-stretch';
    this.inputWrapper.style.flex = '2';
    this.inputWrapper.style.marginLeft = '12px'; // Espaçamento entre o dropdown e o input
    this.inputWrapper.style.gap = '8px'; // Espaçamento entre o input e o botão de remover

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'form-control';
    this.input.setAttribute('aria-label', 'Nome do participante');

    this.inputWrapper.appendChild(this.input);

    // Botão de remover
    this.removeButton = document.createElement  ('button');
    this.removeButton.className = 'btn btn-remove-participante';
    this.removeButton.type = 'button';
    this.removeButton.innerHTML = '🗙';
    this.removeButton.setAttribute('title', 'Remover participante');

    this.inputWrapper.appendChild(this.removeButton);
    

    // Montagem final
    this.container.appendChild(this.dropdownWrapper);
    this.container.appendChild(this.inputWrapper);
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
