export class SubstituicaoForm {
  constructor(juradoSubstituido, juradoSubstituto) {
    this.juradoSubstituido = juradoSubstituido;
    this.juradoSubstituto = juradoSubstituto;
  }

  render() {
    const container = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = `Motivo da substituição de ${this.juradoSubstituido.nome}:`;

    const input = document.createElement('input');
    input.type = 'text';
    input.name = `motivo-${this.juradoSubstituido.id}`;

    container.appendChild(label);
    container.appendChild(input);
    return container;
  }
}
