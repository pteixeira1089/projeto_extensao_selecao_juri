import { sortJuradoSubstitution } from "../control/JuradoSubstitution.js";

export class SubstituicaoForm {
  
  /**
   * 
   * @param {[number, Object]} juradoSubstituido - [juradoKey, jurado] tuple, where juradoKey is the id of the jurado being substituted in jurados array, and jurado is the jurado object.
   * @param {[number, Object]} juradoSubstituto - [juradoKey, jurado] tuple, where juradoKey is the id of the jurado that was sorted to substitute, and jurado is the jurado object.
   * @param {HTMLLIElement} listItem - The <li> element placeholder for the form data
   * @param {String[]} sortedJurados - array of ids representing the jurados that were already sorted
   * @param {number} totalJuradosAlistados - number of total listed jurados
   * @param {Object} jurados - object that is a collection of jurados avaiable for sorting
   * 
   */
  constructor(
    juradoSubstituido, 
    juradoSubstituto,
    listItem,
    sortedJurados,
    totalJuradosAlistados,
    jurados
  ) {
    this.juradoSubstituidoKey = juradoSubstituido[0];
    this.juradoSubstituido = juradoSubstituido[1];
    this.juradoSubstitutoKey = juradoSubstituto[0];
    this.juradoSubstituto = juradoSubstituto[1];
    this.listItem = listItem; // The list item element where the form will be rendered
    this.originalContent = listItem.innerHTML; // Store the original content of the list item - attention: restore the event listeners manually
    this.sortedJurados = sortedJurados;
    this.totalJuradosAlistados = totalJuradosAlistados;
    this.jurados = jurados;
  }

  get juradoSubstituidoTuple() {
    return [this.juradoSubstituidoKey, this.juradoSubstituido];
  }

  render() {
    //General container for the substitution form
    const container = document.createElement('div');
    container.classList.add('substituicao-form');

    // Container for the substitution information
    const containerInfo = document.createElement('div');
    containerInfo.classList.add(
      'substituicao-info', 
      'd-flex', 
      'flex-column', 
      'flex-md-row', 
      'justify-content-between',
      'gap-3'
    );

    
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
      alert('Substituição cancelada!');
    });
    containerButtons.appendChild(confirmButton);
    containerButtons.appendChild(cancelButton);
    container.appendChild(containerButtons);

    return container;
  }

  cancelSubstitution(){
    //Rebuild the original content of the listItem
    this.listItem.innerHTML = this.originalContent
  };

  

};
