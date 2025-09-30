class AppState {
    constructor() {
        this.subscribers = [];
        this.screenControl = -1;
        this.participantesData = [
            { tipo: 'magistrado', nome: 'Magistrado 1' },
            { tipo: 'membroMP', nome: 'Membro do MP 1' },
            { tipo: 'assistenteAcusacao', nome: 'Assistente de acusação 1' },
            { tipo: 'representanteOAB', nome: 'Representante da OAB 1' },
            { tipo: 'defensorConstituido', nome: 'Defensor constituído 1' },
        ];
        this.juradosTitularesData = [
            { nome: 'João da Silva', profissao: 'programador' },
            { nome: 'Maria Oliveira', profissao: 'professora' },
            { nome: 'Carlos Souza', profissao: 'engenheiro' },
            { nome: 'Ana Costa', profissao: 'advogada' },
            { nome: 'Pedro Santos', profissao: 'médico' }
        ];
        this.juradosSuplentesData = [
            { nome: 'Luiz Pereira', profissao: 'arquiteto' },
            { nome: 'Fernanda Lima', profissao: 'psicóloga' },
            { nome: 'Roberto Almeida', profissao: 'contador' },
            { nome: 'Patrícia Rocha', profissao: 'jornalista' },
            { nome: 'Ricardo Gomes', profissao: 'veterinário' }
        ];
        this.substituicoes = [];
        this.signer = {
            nome: 'Pedro G. Teixeira',
            cargo: 'servidor',
            matricula: 'RF 8973'
        };
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify() {
        this.subscribers.forEach(callback => callback());
    }

    setScreenControl(value) {
        this.screenControl = value;
        this.notify();
    }
}

export const appState = new AppState();