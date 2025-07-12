import { sortJuradoSubstitution, substituteJurados } from "../control/JuradoSubstitution.js";

export class SubstituicaoForm {

  /**
   * 
   * @param {[number, Object]} juradoSubstituido - [juradoKey, jurado] tuple, where juradoKey is the id of the jurado being substituted in jurados array, and jurado is the jurado object.
   * @param {[number, Object]} juradoSubstituto - [juradoKey, jurado] tuple, where juradoKey is the id of the jurado that was sorted to substitute, and jurado is the jurado object.
   * @param {HTMLLIElement} listItem - The <li> element placeholder for the form data
   * @param {Object<string,Object>} sortedJurados - array of ids representing the jurados that were already sorted
   * @param {number} totalJuradosAlistados - number of total listed jurados
   * @param {Object} jurados - object that is a collection of jurados avaiable for sorting
   * @param {Object} juradosSubstituidos - object that is a collection of jurados that were already substituted
   * 
   */
  constructor(
    juradoSubstituido,
    juradoSubstituto,
    listItem,
    sortedJurados,
    totalJuradosAlistados,
    jurados,
    juradosSubstituidos,
    juradosTitulares,
    juradosSuplentes
  ) {
    this.juradoSubstituidoKey = juradoSubstituido[0];
    this.juradoSubstituido = juradoSubstituido[1];
    this.juradoSubstitutoKey = juradoSubstituto[0];
    this.juradoSubstituto = juradoSubstituto[1];
    this.listItem = listItem; // The list item element where the form will be rendered
    this.tipoJurado = listItem.dataset.tipoJurado;
    this.listCounter = listItem.dataset.counter; // The counter of the list item, used to identify the position in the sorted list
    this.originalContent = listItem.innerHTML; // Store the original content of the list item - attention: restore the event listeners manually
    this.sortedJurados = sortedJurados;
    this.totalJuradosAlistados = totalJuradosAlistados;
    this.jurados = jurados;
    this.juradosSubstituidos = juradosSubstituidos;
    this.juradosTitulares = juradosTitulares;
    this.juradosSuplentes = juradosSuplentes;
  }

  get juradoSubstituidoTuple() {
    return [this.juradoSubstituidoKey, this.juradoSubstituido];
  }

  get juradoSubstitutoTuple() {
    return [this.juradoSubstitutoKey, this.juradoSubstituto];
  }

  render() {
    //General container for the substitution form
    const container = document.createElement('div');
    container.classList.add('substituicao-form', 'ml-3', 'mr-3');

    //Sets the width to 100%
    //necessary while we don't change the bootstrap CDN reference to the official one
    container.style.width = '100%';

    // Container for the substitution information
    const containerInfo = document.createElement('div');
    containerInfo.classList.add(
      'substituicao-info',
      'd-flex',
      'flex-column',
      'flex-md-row',
      'justify-content-between',
      'gap-3',
      'w-100'
    );
    
    //Sets the width to 100%
    //necessary while we don't change the bootstrap CDN reference to the official one
    containerInfo.style.width = '100%';


    //Info about the jurado being substituted
    const substituidoInfo = document.createElement('div');
    substituidoInfo.classList.add('jurado-info', 'jurado-substituido');
    substituidoInfo.innerHTML = `
      <h5>Jurado Substituído</h5>
      <p><strong>Nome:</strong> ${this.juradoSubstituido.nome}</p>
      <p><strong>Profissão:</strong> ${this.juradoSubstituido.profissao}</p>
      <p><strong>Data de nascimento:</strong> ${this.juradoSubstituido.nascimento}</p>
      `;
    containerInfo.appendChild(substituidoInfo);

    //Info about the substituting jurado
    const substitutoInfo = document.createElement('div');
    substitutoInfo.classList.add('jurado-info', 'jurado-substituto');
    substitutoInfo.innerHTML = `
      <h5>Jurado Substituto</h5>
      <p><strong>Nome:</strong> ${this.juradoSubstituto.nome}</p>
      <p><strong>Profissão:</strong> ${this.juradoSubstituto.profissao}</p>
      <p><strong>Data de nascimento:</strong> ${this.juradoSubstituto.nascimento}</p>
      `;
    containerInfo.appendChild(substitutoInfo);

    //Container for the substitution reason input
    const containerReason = document.createElement('div');
    containerReason.classList.add('substituicao-reason', 'd-flex', 'flex-column', 'gap-2', 'mb-2');

    //substitution reason input
    const label = document.createElement('label');
    label.textContent = `Motivo da substituição:`;
    label.setAttribute('for', `motivo-${this.juradoSubstituido.id}`);

    const input = document.createElement('input');
    input.type = 'text';
    input.name = `motivo-${this.juradoSubstituido.id}`;
    input.id = `motivo-${this.juradoSubstituido.id}`;

    containerReason.appendChild(label);
    containerReason.appendChild(input);


    //Append all parts to the main container
    container.appendChild(containerInfo);
    container.appendChild(containerReason);

    //Control buttons for the form
    const containerButtons = document.createElement('div');
    containerButtons.classList.add('substituicao-buttons');
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmar Substituição';
    confirmButton.classList.add('btn', 'confirm-button', 'btn-primary', 'mb-1');
    confirmButton.addEventListener('click', () => {

      const motivo = input.value.trim();

      if (motivo) {
        // Here you would typically handle the submission, e.g., send to server
        const newJurado = substituteJurados(
          this.listCounter,
          this.sortedJurados,
          this.juradosSubstituidos,
          this.juradoSubstituidoTuple,
          this.juradoSubstitutoTuple,
          this.tipoJurado,
          this.juradosTitulares,
          this.juradosSuplentes,
          motivo
        );

        //Reconstruct the list item with the new jurado
        const itemNumber = document.createElement("span");
        itemNumber.classList.add("badge", "list-number", "rounded-pill");
        itemNumber.textContent = this.listItem.dataset.counter;
        itemNumber.style.marginRight = "1rem";

        const itemContent = document.createElement("div");
        itemContent.classList.add("ms-2", "me-auto");

        const itemTitle = document.createElement("div");
        itemTitle.classList.add("item-title");
        itemTitle.textContent = newJurado['juradoSubstituto'].nome;

        const itemDescription = document.createElement("div");
        itemDescription.classList.add("item-description");
        itemDescription.textContent = newJurado['juradoSubstituto'].profissao;

        const substituirButton = document.createElement("button");
        substituirButton.classList.add("btn", "substitute-button");
        substituirButton.textContent = "Substituir";
        substituirButton.dataset.juradoKey = newJurado['juradoSubstituto'].id; // Store the jurado key in the button's dataset

        itemContent.appendChild(itemTitle);
        itemContent.appendChild(itemDescription);
        this.listItem.innerHTML = ''; // Clear the original content
        this.listItem.appendChild(itemNumber);
        this.listItem.appendChild(itemContent);
        this.listItem.appendChild(substituirButton);

        // Re-enable all substitute buttons
        const allSubstituteButtons = document.querySelectorAll(".substitute-button");
        allSubstituteButtons.forEach(button => {
          button.disabled = false; // Re-enable all substitute buttons
        });


        console.log(`Substituição confirmada: ${this.juradoSubstituido.nome} substituído por ${this.juradoSubstituto.nome} - Motivo: ${motivo}`);
        alert('Substituição confirmada!');
      } else {
        alert('Por favor, informe o motivo da substituição.');
      }
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.classList.add('btn', 'cancel-button', 'btn-secondary', 'mb-1');
    cancelButton.addEventListener('click', () => {

      // Here you would typically handle the cancellation, e.g., close the form
      this.cancelSubstitution();


      //Re-enable all substitute buttons
      const allSubstituteButtons = document.querySelectorAll(".substitute-button");
      allSubstituteButtons.forEach(button => {
        button.disabled = false; // Re-enable all substitute buttons
      });



      console.log('Substituição cancelada');
      //alert('Substituição cancelada!');
    });
    containerButtons.appendChild(confirmButton);
    containerButtons.appendChild(cancelButton);
    container.appendChild(containerButtons);

    return container;
  }

  cancelSubstitution() {
    //Rebuild the original content of the listItem
    this.listItem.innerHTML = this.originalContent
  };



};
