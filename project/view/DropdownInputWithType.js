
export class DropdownInputWithType {
  /**
   * Component that combines a dropdown for selecting a type and an input field for entering a string value.
   * 
   * @param {Object} tipos - Object where keys are internal values and values are display strings.
   * @param {string} instructionString - Instruction string to be displayed in the input field.
   * @param {number|null} selectedIndex - Index of the type to be pre-selected in the dropdown.
   * @param {boolean} disableTypeChange - If true, doesn't allow changing the type.
   * @param {Function} onRemove - Callback function to be called when the remove button is clicked.
   */

  constructor(
    instructionString = '',
    tipos = {},
    selectedIndex = null,
    disableTypeChange = true,
    onRemove = null
  ) {
    // Armazenamento das funções de callback
    this.onRemove = onRemove;

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

    this.button.disabled = disableTypeChange; // Desabilita o botão se disableTypeChange for true

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

        //Rerender input fields if the selected type is 'servidor(a)'
        const tipoParticipante = this.getSelectedTipo();
        if (tipoParticipante === 'servidor') {
          // Se o tipo selecionado for servidor(a), renderiza os campos específicos
          this.inputWrapper = this.renderInputFieldsServidor(this.inputWrapper);
        } else {
          this.inputWrapper = this.renderInputFieldsGeneral(this.inputWrapper);
        }
      });

      li.appendChild(a);
      this.menu.appendChild(li);
    });

    this.dropdownWrapper.appendChild(this.button);
    this.dropdownWrapper.appendChild(this.menu);

    // Campo principal - nome do participante
    this.inputWrapper = document.createElement('div');
    this.inputWrapper.className = 'input-wrapper d-flex align-items-stretch';
    this.inputWrapper.style.flex = '3';
    this.inputWrapper.style.marginLeft = '12px'; // Espaçamento entre o dropdown e o input
    this.inputWrapper.style.gap = '8px'; // Espaçamento entre o input e o botão de remover

    const tipoParticipante = this.getSelectedTipo();

    if (tipoParticipante !== 'servidor') {
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.className = 'form-control';
      this.input.setAttribute('aria-label', 'Nome do participante');

      this.inputWrapper.appendChild(this.input);

      this.renderInputFieldsServidor();

      //Remove button
      this.removeButton = this.renderRemoveButton(); // Renderiza o botão de remover
      this.inputWrapper.appendChild(this.removeButton);
    }

    if (tipoParticipante === 'servidor') {
      // Renderiza os campos específicos para servidor
      this.inputWrapper = this.renderInputFieldsServidor(this.inputWrapper);
    }


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

  getRemoveButton() {
    return this.removeButton;
  }

  getSigner(){
    return {
      nome: this.input.value,
      cargo: this.inputCargo ? this.inputCargo.value : '',
      matricula: this.inputMatricula ? this.inputMatricula.value : ''
    };
  }

  renderRemoveButton() {
    // Botão de remover
    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-remove-participante';
    removeButton.type = 'button';
    removeButton.innerHTML = '🗙';
    removeButton.setAttribute('title', 'Remover participante');

    removeButton.addEventListener('click', () => {
      // Ação de remoção do participante
      this.container.remove();

      if (typeof this.onRemove === 'function') {
        this.onRemove(this); // Notifica quem criou o componente
      }
    });

    return removeButton;
  }

  /**
   * 
   * @param {HTMLElement} inputWrapper 
   */
  renderInputFieldsServidor(inputWrapper = document.createElement('div')) {
    //Clear the inputWrapper
    inputWrapper.innerHTML = '';

    //Input para o nome do participante
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'form-control';
    inputName.setAttribute('aria-label', 'Nome do participante');

    //Atribui o inputName como o atributo input do objeto
    this.input = inputName;

    // Adiciona o input de nome ao inputWrapper
    inputWrapper.appendChild(inputName);

    //Div para o input de cargo
    const inputCargoWrapper = document.createElement('div');
    inputCargoWrapper.className = 'input-cargo-wrapper';
    inputCargoWrapper.classList.add('input-group', 'mb-3', 'align-items-stretch');

    // Span para o input de cargo (descrição do campo)
    const inputCargoSpan = document.createElement('span');
    inputCargoSpan.className = 'input-group-text';
    inputCargoSpan.id = 'input-cargo-addon';
    inputCargoSpan.textContent = 'Cargo:';

    // Input para cargo do servidor
    const inputCargo = document.createElement('input');
    inputCargo.type = 'text';
    inputCargo.className = 'form-control';
    inputCargo.setAttribute('aria-label', 'Cargo do servidor');

    // Atribui o inputCargo como o atributo cargo do objeto
    this.inputCargo = inputCargo;

    //Montagem do elemento de cargo
    inputCargoWrapper.appendChild(inputCargoSpan);
    inputCargoWrapper.appendChild(inputCargo);

    //Adiciona o input de cargo ao inputWrapper
    inputWrapper.appendChild(inputCargoWrapper);


    //Div para o input de matrícula
    const inputMatriculaWrapper = document.createElement('div');
    inputMatriculaWrapper.className = 'input-matricula-wrapper';
    inputMatriculaWrapper.classList.add('input-group', 'mb-3', 'align-items-stretch');

    // Span para o input de matrícula (descrição do campo)
    const inputMatriculaSpan = document.createElement('span');
    inputMatriculaSpan.className = 'input-group-text';
    inputMatriculaSpan.id = 'input-matricula-addon';
    inputMatriculaSpan.textContent = 'RF';

    // Input para matrícula do servidor
    const inputMatricula = document.createElement('input');
    inputMatricula.type = 'text';
    inputMatricula.className = 'form-control';
    inputMatricula.setAttribute('aria-label', 'Matrícula do servidor');

    //Atribui o inputMatricula como o atributo matricula do objeto
    this.inputMatricula = inputMatricula;

    //Montagem do elemento de matrícula
    inputMatriculaWrapper.appendChild(inputMatriculaSpan);
    inputMatriculaWrapper.appendChild(inputMatricula);

    //Adiciona o input de matrícula ao inputWrapper
    inputWrapper.appendChild(inputMatriculaWrapper);

    // Cria e adiciona o botão de remover
    const removeButton = this.renderRemoveButton();
    inputWrapper.appendChild(removeButton);

    // Retorna o inputWrapper atualizado
    return inputWrapper;


  }

  renderInputFieldsGeneral(inputWrapper = document.createElement('div')) {
    //Clear the inputWrapper
    inputWrapper.innerHTML = '';

    //Input para o nome do participante
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'form-control';
    inputName.setAttribute('aria-label', 'Nome do participante');

    // Adiciona o input de nome ao inputWrapper
    inputWrapper.appendChild(inputName);

    // Cria e adiciona o botão de remover
    const removeButton = this.renderRemoveButton();
    inputWrapper.appendChild(removeButton);

    // Retorna o inputWrapper atualizado
    return inputWrapper;

  }
}
