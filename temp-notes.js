
//Formatação para listas:
// Criar o contêiner para a lista com rolagem
const listWrapper = document.createElement("div");
listWrapper.style.maxHeight = "400px"; // Define a altura máxima da lista
listWrapper.style.overflowY = "auto"; // Adiciona a barra de rolagem vertical quando necessário
listWrapper.style.border = "1px solid #ddd"; // Adiciona uma borda para destaque
listWrapper.style.padding = "0.5rem"; // Adiciona um pequeno padding