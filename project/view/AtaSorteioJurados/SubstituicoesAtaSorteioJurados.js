import { appState } from '../../appState.js';

export class SubstituicoesAtaSorteioJurados {

    /**
     * 
     * @param {[Object]} substituicoes - Array of objects representing the substitutions.
     */
    constructor(substituicoes = appState.substituicoes || []) {
        this.substituicoes = substituicoes;
    }

    /**
     * Creates the substitutions list element for the Ata de Sorteio dos Jurados.
     * @returns {HTMLElement} - The paragraphs elements containing the list of presences.
     */
    create() {
        const substituicoesDiv = document.createElement('div');
        substituicoesDiv.classList.add(
            'ata-sorteio-jurados-substituicoes', 
            'mb-4', 
            'mx-auto',  
            'text-justify'
        );

        substituicoesDiv.style.maxWidth = '800px'; // Sets a maximum width for the presence list

        if (this.substituicoes.length === 0) {
            const noSubstitutions = document.createElement('p');
            noSubstitutions.textContent = 'Não foi realizada nenhuma substituição dos jurados inicialmente sorteados.';
            substituicoesDiv.appendChild(noSubstitutions);
            return substituicoesDiv;
        }

        const title = document.createElement('p');
        title.classList.add('mb-3', 'text-center');
        title.innerHTML = '<strong><u>Substituições:</u></strong>';
        substituicoesDiv.appendChild(title);
        
        this.substituicoes.forEach((substituicao, index) => {
            
            //Substitution container - holds all substitution data
            const substitutionContainer = document.createElement('div');
            substitutionContainer.classList.add('substitution-container', 'mb-3', 'container', 'text-center');
            substitutionContainer.style.border = '1px solid black';

            
            //Substitution title
            const substitutionTitleRowDiv = document.createElement('div')
            substitutionTitleRowDiv.classList.add('substitution-title', 'mb-1', 'row', 'text-center');
            
            const substitutionTitleColDiv = document.createElement('div');
            substitutionTitleColDiv.classList.add('col');
            substitutionTitleRowDiv.appendChild(substitutionTitleColDiv);
            
            const substitutionTitle = document.createElement('p');
            substitutionTitle.classList.add('text-center', 'mb-0');
            substitutionTitle.innerHTML = `<strong>Substituição ${index + 1} </strong>`;
            substitutionTitleColDiv.appendChild(substitutionTitle);
            
            const substitutionReason = document.createElement('p');
            substitutionReason.innerHTML = `(<strong>Motivo:</strong> ${substituicao.motivo})`;
            substitutionReason.classList.add('text-center', 'mb-0');
            substitutionTitleColDiv.appendChild(substitutionReason);

            
            //Substitution data - holds the jurado substituído and jurado substituto information
            const juradoSubstitutionData = document.createElement('div');
            juradoSubstitutionData.classList.add('row')


            //Jurado Substituído data
            const juradoSubstituido = document.createElement('div');
            juradoSubstituido.classList.add('col', 'text-start', 'mx-2');

            const juradoSubstituidoName = document.createElement('p');
            juradoSubstituidoName.innerHTML = `<strong>Jurado Substituído:</strong> ${substituicao.juradoSubstituido.nome}`;
            const juradoSubstituidoProfissao = document.createElement('p');
            juradoSubstituidoProfissao.innerHTML = `<strong>Profissão:</strong> ${substituicao.juradoSubstituido.profissao}`;
            
            juradoSubstituido.appendChild(juradoSubstituidoName);
            juradoSubstituido.appendChild(juradoSubstituidoProfissao);

            juradoSubstitutionData.appendChild(juradoSubstituido);


            //Jurado Substituto data
            const juradoSubstituto = document.createElement('div');
            juradoSubstituto.classList.add('col', 'text-start', 'mx-2');

            const juradoSubstitutoName = document.createElement('p');
            juradoSubstitutoName.innerHTML = `<strong>Jurado Substituto:</strong> ${substituicao.juradoSubstituto.nome}`;
            const juradoSubstitutoProfissao = document.createElement('p');
            juradoSubstitutoProfissao.innerHTML = `<strong>Profissão:</strong> ${substituicao.juradoSubstituto.profissao}`;

            juradoSubstituto.appendChild(juradoSubstitutoName);
            juradoSubstituto.appendChild(juradoSubstitutoProfissao);

            juradoSubstitutionData.appendChild(juradoSubstituto);


            //Substitution reason
            const motivoSubstituicao = document.createElement('div');
            motivoSubstituicao.classList.add('row', 'text-center');
            motivoSubstituicao.innerHTML = `<strong>Motivo da substituição: </strong> ${substituicao.motivo}`;

            // Mounting the substitution container
            substitutionContainer.appendChild(substitutionTitleRowDiv);
            substitutionContainer.appendChild(juradoSubstitutionData);
            //substitutionContainer.appendChild(motivoSubstituicao);

            // Append the substitution container to the main div
            substituicoesDiv.appendChild(substitutionContainer);
        });

        return substituicoesDiv;
    }
}