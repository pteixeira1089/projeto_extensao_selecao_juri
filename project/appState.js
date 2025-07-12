export const appState = {
    screenControl: 0,
    participantesData: [
        {tipo: 'magistrado', nome: 'Magistrado 1'},
        {tipo: 'membroMP', nome: 'Membro do MP 1'},
        {tipo: 'assistenteAcusacao', nome: 'Assistente de acusação 1'},
        {tipo: 'representanteOAB', nome: 'Representante da OAB 1'},
        {tipo: 'defensorConstituido', nome: 'Defensor constituído 1'},
    ],
    juradosTitularesData: [
        {nome: 'João da Silva', profissao: 'programador'},
        {nome: 'Maria Oliveira', profissao: 'professora'},
        {nome: 'Carlos Souza', profissao: 'engenheiro'},
        {nome: 'Ana Costa', profissao: 'advogada'},
        {nome: 'Pedro Santos', profissao: 'médico'}
    ],
    juradosSuplentesData: [
        {nome: 'Luiz Pereira', profissao: 'arquiteto'},
        {nome: 'Fernanda Lima', profissao: 'psicóloga'},
        {nome: 'Roberto Almeida', profissao: 'contador'},
        {nome: 'Patrícia Rocha', profissao: 'jornalista'},
        {nome: 'Ricardo Gomes', profissao: 'veterinário'}
    ],

    substituicoes: [],
    
    signer: {
        nome: 'Pedro G. Teixeira',
        cargo: 'servidor',
        matricula: 'RF 8973'
    }
};