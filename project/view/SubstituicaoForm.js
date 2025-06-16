export class SubstituicaoForm {
  constructor(juradoSubstituido, juradoSubstituto) {
    this.juradoSubstituido = juradoSubstituido;
    this.juradoSubstituto = juradoSubstituto;
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
      console.log('Substituição cancelada');
      alert('Substituição cancelada!');
    });
    containerButtons.appendChild(confirmButton);
    containerButtons.appendChild(cancelButton);
    container.appendChild(containerButtons);

    return container;
  }
}
