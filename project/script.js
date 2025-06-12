//import { uploadExcel, downloadMockData } from './functions.js';
import { SubstituicaoForm } from "./view/SubstituicaoForm.js";
import { Jurado } from "./model/jurado.js";

function uploadExcel() {
    return new Promise((resolve, reject) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".xlsx, .xls"; // Accept Excel files
        fileInput.style.display = "none";
        document.body.appendChild(fileInput);

        fileInput.click();

        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                    console.log("File selected:", file.name);

                    // Read the file
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: "array" });

                        // Assume the first sheet is the one we need
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];

                        // Convert sheet to JSON
                        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                        // Find the required columns
                        const headerRow = jsonData[0]; // First row is the header
                        const columnIndices = findColumnIndices(headerRow);

                        if (columnIndices) {
                            // Extract data into the 'jurados' object
                            const jurados = extractJuradosData(jsonData, columnIndices);
                            console.log("Jurados:", jurados);
                            resolve(jurados); // Resolve the promise with the jurados object
                        } else {
                            reject("Required columns not found.");
                        }
                    };
                    reader.readAsArrayBuffer(file);
                } else {
                    reject("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
                }
            }
            document.body.removeChild(fileInput);
        });
    });
}

function downloadMockData() {
    // Path to the mock data file
    const filePath = "./mock_data/jurados_mock_data.xlsx";

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = filePath;

    // Set the download attribute with the desired file name
    link.download = "modelo_planilha_jurados.xlsx";

    // Append the link to the document body (required for Firefox)
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}

// Helper function to find column indices
function findColumnIndices(headerRow) {
    const requiredColumns = [
        "id", 
        "nome",
        "nomesocial", 
        "genero", 
        "cpf", 
        "email", 
        "endereco", 
        "escolaridade", 
        "profissao", 
        "nascimento"
    ];
    const columnIndices = {};

    for (let i = 0; i < headerRow.length; i++) {
        const header = normalizeString(headerRow[i]);
        console.log(header);
        if (requiredColumns.includes(header)) {
            columnIndices[header] = i;
        }
    }

    // Check if all required columns were found
    if (Object.keys(columnIndices).length === requiredColumns.length) {
        return columnIndices;
    } else {
        return null;
    }
}

// Helper function to normalize strings (ignore case and accents)
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize("NFD") // Normalize accents
        .replace(/[\u0300-\u036f]/g, ""); // Remove accents
}

// Helper function to extract data into the 'jurados' object
function extractJuradosData(jsonData, columnIndices) {
    const jurados = {};

    // Start from the second row (skip header)
    for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];

        const id = row[columnIndices["id"]];
        const nome = row[columnIndices["nome"]];
        const nomeSocial = row[columnIndices["nomesocial"]];
        const genero = row[columnIndices["genero"]];
        const cpf = row[columnIndices["cpf"]];
        //const email = row[columnIndices["email"]];
        const endereco = row[columnIndices["endereco"]];
        const escolaridade = row[columnIndices["escolaridade"]];
        const profissao = row[columnIndices["profissao"]];
        const nascimento = row[columnIndices["nascimento"]];

        if (id && nome && cpf && endereco && nascimento) {
            
            //Creates an instance of jurado and adds it to the jurados object
            const jurado = new Jurado(id, nome, nomeSocial, null, cpf, null, endereco, profissao, nascimento, genero, escolaridade);
            jurados[id] = jurado;
        }
    }

    return jurados;
}

//Implementation of the logic of the sorting page
let screenControl = 0;
let jurados = null; // Store the jurados object globally
let totalJuradosAlistados = 0;
let nomeJuri = "";
let formaSorteio = "";
let quantidadeJuradosTitulares = 0;
let quantidadeJuradosSuplentes = 0;

function createParagraph(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
}

function generateList(jurados) {
    // Criar o contêiner para a lista com rolagem
    const listWrapper = document.createElement("div");
    listWrapper.style.maxHeight = "400px"; // Define a altura máxima da lista
    listWrapper.style.overflowY = "auto"; // Adiciona a barra de rolagem vertical quando necessário
    listWrapper.style.border = "none"; // Adiciona uma borda para destaque
    listWrapper.style.padding = "0.5rem"; // Adiciona um pequeno padding

    const listContainer = document.createElement("ol");
    listContainer.classList.add("list-group", "list-group-numbered");

    let counter = 1;

    for (const [numero, { nome, profissao }] of Object.entries(jurados)) {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "align-items-center");

        const itemNumber = document.createElement("span");
        itemNumber.classList.add("badge", "list-number", "rounded-pill");
        itemNumber.textContent = `${counter}. `;
        itemNumber.style.marginRight = "1rem";

        const itemContent = document.createElement("div");
        itemContent.classList.add("ms-2", "me-auto");

        const itemTitle = document.createElement("div");
        itemTitle.classList.add("item-title");
        itemTitle.textContent = nome;

        const itemDescription = document.createElement("div");
        itemDescription.classList.add("item-description");
        itemDescription.textContent = profissao;

        itemContent.appendChild(itemTitle);
        itemContent.appendChild(itemDescription);
        listItem.appendChild(itemNumber);
        listItem.appendChild(itemContent);

        listContainer.appendChild(listItem);
        counter++;
    }

    listWrapper.appendChild(listContainer); // Adicionar a lista dentro do contêiner de rolagem

    totalJuradosAlistados = Object.keys(jurados).length;

    return listWrapper;
}


function clearScreen() {
    const contentDiv = document.getElementById("content");
    const actionDiv = document.getElementById("actions");
    contentDiv.innerHTML = ""; // Clear contentDiv
    actionDiv.innerHTML = ""; // Clear actionDiv
}

function loadScreen() {
    const contentDiv = document.getElementById("content");
    const actionDiv = document.getElementById("actions");

    if (screenControl == 0) {
        clearScreen(); // Clear the screen before generating new elements

        const title = document.createElement("h3");
        title.classList.add("mb-4");
        title.textContent = "Sistema Eletrônico de Sorteio do Júri";

        const p1 = createParagraph("O Sistema Eletrônico de Sorteio de Júri surgiu com a finalidade de informatizar o procedimento de sorteio dos jurados, previsto nos arts. 432 a 435 do Código de Processo Penal (CPP).");
        const p2 = createParagraph("Este sistema utiliza como base uma planilha contendo a listagem dos jurados alistados, conforme previsto nos artigos 425 e 426 do CPP.");

        const titleRow = document.createElement("div");
        titleRow.classList.add("row", "text-row");

        const titleCol = document.createElement("div");
        titleCol.classList.add("col-12");

        titleCol.appendChild(title);
        titleRow.appendChild(titleCol);
        contentDiv.appendChild(titleRow);

        const contentRow = document.createElement("div");
        contentRow.classList.add("row", "text-row");

        const contentCol = document.createElement("div");
        contentCol.classList.add("col-12");

        contentCol.appendChild(p1);
        contentCol.appendChild(p2);

        contentRow.appendChild(contentCol);
        contentDiv.appendChild(contentRow);

        const uploadRow = document.createElement("div");
        uploadRow.classList.add("row", "action-row");

        const downloadRow = document.createElement("div");
        downloadRow.classList.add("row", "action-row");

        const downloadCol = document.createElement("div");
        downloadCol.classList.add("col-12");

        const uploadCol = document.createElement("div");
        uploadCol.classList.add("col-12");

        const uploadButton = document.createElement("button");
        uploadButton.classList.add("btn", "btn-primary", "mb-3");
        uploadButton.textContent = "Já possuo a planilha de jurados alistados";

        const downloadButton = document.createElement("button");
        downloadButton.classList.add("btn", "btn-secondary", "mb-3");
        downloadButton.textContent = "Baixar modelo de planilha de jurados alistados";

        // Add event listener to upload button
        uploadButton.addEventListener("click", () => {
            uploadExcel()
                .then((data) => {
                    jurados = data; // Store the jurados object
                    screenControl = 1; // Update screenControl
                    loadScreen(); // Reload the screen
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(error); // Show error message to the user
                });
        });

        // Add event listener to download button
        downloadButton.addEventListener("click", downloadMockData);

        downloadCol.appendChild(downloadButton);
        downloadRow.appendChild(downloadCol);

        uploadCol.appendChild(uploadButton);
        uploadRow.appendChild(uploadCol);

        actionDiv.appendChild(uploadRow);
        actionDiv.appendChild(downloadRow);
    }

    if (screenControl == 1) {
        clearScreen(); // Clear the screen before generating new elements

        // Add your logic for screenControl == 1 here
        const horizontalRule = document.createElement("hr");
        const title = document.createElement("h3");
        title.classList.add("mb-4");
        title.textContent = "Jurados alistados (art. 425, CPP)";

        const p1 = createParagraph(`Total de jurados alistados: ${Object.keys(jurados).length}`);

        const titleRow = document.createElement("div");
        titleRow.classList.add("row", "text-row");

        const titleCol = document.createElement("div");
        titleCol.classList.add("col-12");

        titleCol.appendChild(horizontalRule);
        titleCol.appendChild(title);
        titleRow.appendChild(titleCol);
        contentDiv.appendChild(titleRow);

        const contentRow = document.createElement("div");
        contentRow.classList.add("row", "text-row");

        const contentCol = document.createElement("div");
        contentCol.classList.add("col-12");

        // Generate and append the list of jurados
        const juradosList = generateList(jurados);
        contentCol.appendChild(juradosList);

        contentCol.appendChild(p1);

        contentRow.appendChild(contentCol);
        contentDiv.appendChild(contentRow);

        //Action buttons
        const nextButton = document.createElement("button");
        nextButton.classList.add("btn", "btn-primary", "mb-3");
        nextButton.textContent = "Tudo certo: prosseguir para configuração do sorteio";

        const backButton = document.createElement("button");
        backButton.classList.add("btn", "btn-secondary", "mb-3");
        backButton.textContent = "Voltar: alterar lista de jurados alistados";

        nextButton.addEventListener("click", () => {
            screenControl = 2; // Update screenControl
            loadScreen(); // Reload the screen
        });

        backButton.addEventListener("click", () => {
            screenControl = 0; // Update screenControl
            loadScreen(); // Reload the screen
        });

        const backRow = document.createElement("div");
        backRow.classList.add("row", "action-row");

        const backCol = document.createElement("div");
        backCol.classList.add("col-12");

        const nextRow = document.createElement("div");
        nextRow.classList.add("row", "action-row");

        const nextCol = document.createElement("div");
        nextCol.classList.add("col-12");

        backCol.appendChild(backButton);
        backRow.appendChild(backCol);

        nextCol.appendChild(nextButton);
        nextRow.appendChild(nextCol);

        actionDiv.appendChild(nextRow);
        actionDiv.appendChild(backRow);
    }

    if (screenControl == 2) {
        clearScreen(); // Clear the screen before generating new elements

        // Add your logic for screenControl == 1 here
        const horizontalRule = document.createElement("hr");
        const title = document.createElement("h3");
        title.classList.add("mb-4");
        title.textContent = "Configuração do sorteio";

        const configurationForm = document.createElement("form");

        //Nome do júri elements        
        const juriNameLabel = document.createElement("label");
        juriNameLabel.for = "juriName";
        juriNameLabel.classList.add("form-label", "h5");
        juriNameLabel.textContent = "Nome do júri";

        const juriNameInput = document.createElement("input");
        juriNameInput.type = "text";
        juriNameInput.id = "juriName";
        juriNameInput.classList.add("form-control", "aria-describedby='juriNameHelp'");

        const juriNameInputTip = document.createElement("div");
        juriNameInputTip.id = "juriNameHelp";
        juriNameInputTip.classList.add("form-text");
        juriNameInputTip.textContent = "Ex.: Ação Penal de competência do Júri n. 0000000-00.0000.4.03.6181";

        const juriNameInputDiv = document.createElement("div");
        juriNameInputDiv.classList.add("col-12", "mb-5");
        juriNameInputDiv.appendChild(juriNameLabel);
        juriNameInputDiv.appendChild(juriNameInput);
        juriNameInputDiv.appendChild(juriNameInputTip);


        //Forma de sorteio elements
        const formaSorteioLabel = document.createElement("h5");
        formaSorteioLabel.textContent = "Forma de sorteio";

        const formaSorteioRadioControl = document.createElement("div");
        formaSorteioRadioControl.classList.add("form-check", "mb-3");

        const allAtOnceRadio = document.createElement("input");
        allAtOnceRadio.type = "radio";
        allAtOnceRadio.id = "allAtOnceRadio";
        allAtOnceRadio.name = "formaSorteio";
        allAtOnceRadio.classList.add("form-check-input");

        const allAtOnceLabel = document.createElement("label");
        allAtOnceLabel.htmlFor = "allAtOnceRadio";
        allAtOnceLabel.classList.add("form-check-label");
        allAtOnceLabel.textContent = "Todos os nomes de uma vez (1 clique)";

        const oneNamePerClickRadio = document.createElement("input");
        oneNamePerClickRadio.type = "radio";
        oneNamePerClickRadio.id = "onePerClickRadio";
        oneNamePerClickRadio.name = "formaSorteio";
        oneNamePerClickRadio.classList.add("form-check-input");

        const oneNamePerClickLabel = document.createElement("label");
        oneNamePerClickLabel.htmlFor = "onePerClickRadio";
        oneNamePerClickLabel.classList.add("form-check-label");
        oneNamePerClickLabel.textContent = "Um nome por vez";


        //Forma de sorteio divs
        const formaSorteioDiv = document.createElement("div");
        formaSorteioDiv.classList.add("col-12", "mb-5");
        formaSorteioDiv.appendChild(formaSorteioLabel);
        formaSorteioDiv.appendChild(formaSorteioRadioControl);

        const allAtOnceRadioDiv = document.createElement("div");
        allAtOnceRadioDiv.classList.add("col-12", "mb-1");

        const oneNamePerClickRadioDiv = document.createElement("div");
        oneNamePerClickRadioDiv.classList.add("col-12", "mb-1");

        allAtOnceRadioDiv.appendChild(allAtOnceRadio);
        allAtOnceRadioDiv.appendChild(allAtOnceLabel);
        oneNamePerClickRadioDiv.appendChild(oneNamePerClickRadio);
        oneNamePerClickRadioDiv.appendChild(oneNamePerClickLabel);

        formaSorteioRadioControl.appendChild(allAtOnceRadioDiv);
        formaSorteioRadioControl.appendChild(oneNamePerClickRadioDiv);


        //Quantidade de jurados - título
        const quantidadeJuradosTitleDiv = document.createElement("div");
        quantidadeJuradosTitleDiv.classList.add("col-12", "ms-0", "p-0", "mb-1");

        const quantidadeJurados = document.createElement("h5");
        quantidadeJurados.textContent = "Quantidade de jurados";
        quantidadeJuradosTitleDiv.appendChild(quantidadeJurados);

        //Quantidade de jurados - form control
        const quantidadeJuradosFormControl = document.createElement("div");
        quantidadeJuradosFormControl.classList.add("col-12", "mb-5", "quantidade-jurados-form-control", "d-flex", "flex-wrap");

        //Quantidade de jurados - titulares e suplentes
        const inputQuantidadeJuradosTitulares = document.createElement("input");
        inputQuantidadeJuradosTitulares.classList.add("form-control", "col-3");
        inputQuantidadeJuradosTitulares.type = "number";
        inputQuantidadeJuradosTitulares.value = "25"
        inputQuantidadeJuradosTitulares.id = "quantidadeJuradosTitulares";
        inputQuantidadeJuradosTitulares.name = "quantidadeJuradosTitulares";
        inputQuantidadeJuradosTitulares.min = "1"
        inputQuantidadeJuradosTitulares.max = totalJuradosAlistados - 1;

        // Function to update the max value of quantidadeJuradosSuplentes
        inputQuantidadeJuradosTitulares.addEventListener("input", function () {
            const titulares = parseInt(this.value) || 0;

            inputQuantidadeJuradosSuplentes.max = totalJuradosAlistados - titulares;

            // Ensure suplentes value does not exceed the new max
            if (inputQuantidadeJuradosSuplentes.value > inputQuantidadeJuradosSuplentes.max) {
                inputQuantidadeJuradosSuplentes.value = inputQuantidadeJuradosSuplentes.max;
            }
        });



        const quantidadeJuradosTitularesLabel = document.createElement("label");
        quantidadeJuradosTitularesLabel.htmlFor = "quantidadeJuradosTitulares";
        quantidadeJuradosTitularesLabel.classList.add("form-check-label", "mr-2", "col-6");
        quantidadeJuradosTitularesLabel.textContent = "Quantidade de jurados titulares: ";

        const inputQuantidadeJuradosSuplentes = document.createElement("input");
        inputQuantidadeJuradosSuplentes.classList.add("col-3", "form-control");
        inputQuantidadeJuradosSuplentes.type = "number";
        inputQuantidadeJuradosSuplentes.value = "25"
        inputQuantidadeJuradosSuplentes.id = "quantidadeJuradosSuplentes";
        inputQuantidadeJuradosSuplentes.name = "quantidadeJuradosSuplentes";
        inputQuantidadeJuradosSuplentes.min = "1"
        inputQuantidadeJuradosSuplentes.max = totalJuradosAlistados - 1; //this value is dynamically adjsted - see the event listener added to quantidadeJuradosTitulares

        const quantidadeJuradosSuplentesLabel = document.createElement("label");
        quantidadeJuradosSuplentesLabel.htmlFor = "quantidadeJuradosSuplentes";
        quantidadeJuradosSuplentesLabel.classList.add("form-check-label", "mr-2", "col-6");
        quantidadeJuradosSuplentesLabel.textContent = "Quantidade de jurados suplentes: ";

        const quantidadeJuradosTitularesDiv = document.createElement("div");
        quantidadeJuradosTitularesDiv.classList.add("mb-1", "d-flex", "align-items-center", "mr-3");

        const quantidadeJuradosSuplentesDiv = document.createElement("div");
        quantidadeJuradosSuplentesDiv.classList.add("mb-1", "d-flex", "align-items-center", "mr-3");

        const quantidadeJuradosInputsDiv = document.createElement("div");
        quantidadeJuradosInputsDiv.classList.add("col-12", "d-flex", "flex-wrap");

        quantidadeJuradosTitularesDiv.appendChild(quantidadeJuradosTitularesLabel);
        quantidadeJuradosTitularesDiv.appendChild(inputQuantidadeJuradosTitulares);

        quantidadeJuradosInputsDiv.appendChild(quantidadeJuradosTitularesDiv);
        quantidadeJuradosInputsDiv.appendChild(quantidadeJuradosSuplentesDiv);

        quantidadeJuradosSuplentesDiv.appendChild(quantidadeJuradosSuplentesLabel);
        quantidadeJuradosSuplentesDiv.appendChild(inputQuantidadeJuradosSuplentes);

        quantidadeJuradosFormControl.appendChild(quantidadeJuradosTitleDiv);
        quantidadeJuradosFormControl.appendChild(quantidadeJuradosInputsDiv);

        configurationForm.appendChild(juriNameInputDiv);
        configurationForm.appendChild(formaSorteioDiv);
        configurationForm.appendChild(quantidadeJuradosFormControl);



        //Page building
        const titleRow = document.createElement("div");
        titleRow.classList.add("row", "text-row");

        const titleCol = document.createElement("div");
        titleCol.classList.add("col-12");

        titleCol.appendChild(horizontalRule);
        titleCol.appendChild(title);
        titleRow.appendChild(titleCol);
        contentDiv.appendChild(titleRow);

        const contentRow = document.createElement("div");
        contentRow.classList.add("row", "text-row", "text-left");

        const contentCol = document.createElement("div");
        contentCol.classList.add("col-12");


        contentCol.appendChild(configurationForm);
        contentRow.appendChild(contentCol);
        contentDiv.appendChild(contentRow);


        //Action buttons
        const nextButton = document.createElement("button");
        nextButton.classList.add("btn", "btn-primary", "mb-3");
        nextButton.textContent = "Tudo certo: prosseguir para sorteio de jurados";

        const backButton = document.createElement("button");
        backButton.classList.add("btn", "btn-secondary", "mb-3");
        backButton.textContent = "Voltar: ver lista de jurados alistados";

        nextButton.addEventListener("click", () => {
            event.preventDefault();

            nomeJuri = juriNameInput.value;
            formaSorteio = allAtOnceRadio.checked ? "allAtOnce" : "onePerClick";
            quantidadeJuradosTitulares = parseInt(inputQuantidadeJuradosTitulares.value) || 0;
            quantidadeJuradosSuplentes = parseInt(inputQuantidadeJuradosSuplentes.value) || 0;

            screenControl = 3; // Update screenControl
            loadScreen(); // Reload the screen
        });

        backButton.addEventListener("click", () => {
            event.preventDefault();
            screenControl = 1; // Update screenControl
            loadScreen(); // Reload the screen
        });

        const backRow = document.createElement("div");
        backRow.classList.add("row", "action-row");

        const backCol = document.createElement("div");
        backCol.classList.add("col-12");

        const nextRow = document.createElement("div");
        nextRow.classList.add("row", "action-row");

        const nextCol = document.createElement("div");
        nextCol.classList.add("col-12");

        backCol.appendChild(backButton);
        backRow.appendChild(backCol);

        nextCol.appendChild(nextButton);
        nextRow.appendChild(nextCol);

        actionDiv.appendChild(nextRow);
        actionDiv.appendChild(backRow);
    }

    if (screenControl == 3) {
        clearScreen(); // Clear the screen before generating new elements

        // Add your logic for screenControl == 3 here
        const horizontalRule = document.createElement("hr");
        const title = document.createElement("h3");
        title.classList.add("mb-4");
        title.textContent = "Certidões (CPP, art. 432)";

        const paragraph = createParagraph("Certifico que foram intimados a acompanhar o processo de sorteio representantes dos seguintes órgãos e entidades:");

        const form = document.createElement("form");

        const checkboxes = [
            { id: "mpf", label: "Ministério Público Federal" },
            { id: "assistenteAcusacao", label: "Assistente de acusação" },
            { id: "oab", label: "Ordem dos Advogados do Brasil" },
            { id: "dpu", label: "Defensoria Pública da União" },
            { id: "defesaConstituida", label: "Defesa constituída" }
        ];

        const checkboxStates = {
            mpf: false,
            assistenteAcusacao: false,
            oab: false,
            dpu: false,
            defesaConstituida: false
        };

        checkboxes.forEach(({ id, label }) => {
            const div = document.createElement("div");
            div.classList.add("form-check", "mb-4");

            const input = document.createElement("input");
            input.type = "checkbox";
            input.classList.add("form-check-input");
            input.id = id;
            input.name = id;

            input.addEventListener("change", (event) => {
                checkboxStates[id] = event.target.checked;
                checkAllSelected();
            });

            const inputLabel = document.createElement("label");
            inputLabel.classList.add("form-check-label");
            inputLabel.htmlFor = id;
            inputLabel.textContent = label;

            div.appendChild(input);
            div.appendChild(inputLabel);
            form.appendChild(div);
        });

        function checkAllSelected() {
            const allSelected = Object.values(checkboxStates).every(Boolean);
            realizarSorteioButton.disabled = !allSelected;
        }

        // Action buttons
        const realizarSorteioButton = document.createElement("button");
        realizarSorteioButton.classList.add("btn", "btn-primary", "mb-3");
        realizarSorteioButton.textContent = "Realizar sorteio";
        realizarSorteioButton.disabled = true;

        const voltarButton = document.createElement("button");
        voltarButton.classList.add("btn", "btn-secondary", "mb-3");
        voltarButton.textContent = "Voltar: alterar configurações de sorteio";

        realizarSorteioButton.addEventListener("click", (event) => {
            event.preventDefault();

            // Update global variables
            Object.keys(checkboxStates).forEach(key => {
                window[key] = checkboxStates[key];
            });

            // Proceed to the next screen or perform the draw
            screenControl = 4;
            loadScreen(); // Reload the screen if needed
        });

        voltarButton.addEventListener("click", (event) => {
            event.preventDefault();
            screenControl = 2; // Update screenControl
            loadScreen(); // Reload the screen
        });

        const backRow = document.createElement("div");
        backRow.classList.add("row", "action-row");

        const backCol = document.createElement("div");
        backCol.classList.add("col-12");

        const nextRow = document.createElement("div");
        nextRow.classList.add("row", "action-row");

        const nextCol = document.createElement("div");
        nextCol.classList.add("col-12");

        backCol.appendChild(voltarButton);
        backRow.appendChild(backCol);

        nextCol.appendChild(realizarSorteioButton);
        nextRow.appendChild(nextCol);

        actionDiv.appendChild(nextRow);
        actionDiv.appendChild(backRow);

        // Page building
        const titleRow = document.createElement("div");
        titleRow.classList.add("row", "text-row", "justify-content-center");

        const titleCol = document.createElement("div");
        titleCol.classList.add("col-12", "text-center");

        titleCol.appendChild(horizontalRule);
        titleCol.appendChild(title);
        titleRow.appendChild(titleCol);
        contentDiv.appendChild(titleRow);

        const contentRow = document.createElement("div");
        contentRow.classList.add("row", "text-row", "justify-content-center");

        const contentCol = document.createElement("div");
        contentCol.classList.add("col-10", "text-center");

        contentCol.appendChild(paragraph);
        contentCol.appendChild(form);
        contentRow.appendChild(contentCol);
        contentDiv.appendChild(contentRow);
    }

    if (screenControl == 4) {
        clearScreen(); // Clear the screen before generating new elements

        const horizontalRuleTitulares = document.createElement("hr");
        const horizontalRuleSuplentes = document.createElement("hr");
        const title = document.createElement("h3");
        title.classList.add("mb-4");
        title.textContent = `Sorteio de Jurados para o ${nomeJuri}`;

        const titularesListWrapper = document.createElement("div");
        titularesListWrapper.classList.add("col-12", "col-md-5", "mb-4", "selected-jurados-list");
        const titularesTitle = document.createElement("h4");
        titularesTitle.textContent = "Jurados Titulares";
        titularesListWrapper.appendChild(titularesTitle);
        titularesListWrapper.appendChild(horizontalRuleTitulares);

        const suplentesListWrapper = document.createElement("div");
        suplentesListWrapper.classList.add("col-12", "col-md-5", "mb-4", "selected-jurados-list");
        const suplentesTitle = document.createElement("h4");
        suplentesTitle.textContent = "Jurados Suplentes";
        suplentesListWrapper.appendChild(suplentesTitle);
        suplentesListWrapper.appendChild(horizontalRuleSuplentes);

        const titularesListContainer = document.createElement("ol");
        titularesListContainer.id = "titularesList";
        titularesListContainer.classList.add("list-group", "list-group-numbered");
        titularesListWrapper.appendChild(titularesListContainer);

        const suplentesListContainer = document.createElement("ol");
        suplentesListContainer.id = "suplentesList";
        suplentesListContainer.classList.add("list-group", "list-group-numbered");
        suplentesListWrapper.appendChild(suplentesListContainer);

        const contentRow = document.createElement("div");
        contentRow.classList.add("row", "text-row", "justify-content-around");

        contentRow.appendChild(titularesListWrapper);
        contentRow.appendChild(suplentesListWrapper);
        contentDiv.appendChild(contentRow);

        let titularesCounter = 1;
        let suplentesCounter = 1;
        let sortedJurados = [];

        //variables for storing jurados titulares and titulares suplentes
        let juradosTitulares = {};
        let juradosSuplentes = {};

        //Functions used in the implementation of the logic of the sorting page

        function sortearJurado(tipoJurado) {
            if (sortedJurados.length >= totalJuradosAlistados) {
                return null;
            }

            let jurado;
            do {
                const randomIndex = Math.floor(Math.random() * totalJuradosAlistados);
                jurado = Object.entries(jurados)[randomIndex];
            } while (sortedJurados.includes(jurado[0]));

            let numeroJurado = jurado[0];

            sortedJurados.push(numeroJurado);

            if (tipoJurado === "titular") {
                juradosTitulares[numeroJurado] = { nome: jurado[1].nome, profissao: jurado[1].profissao };
            }

            if (tipoJurado === "suplente") {
                juradosSuplentes[numeroJurado] = { nome: jurado[1].nome, profissao: jurado[1].profissao };
            }

            return jurado;
        }

        function addJuradoToList(jurado, listContainer, counter) {
            const [numero, { nome, profissao }] = jurado;

            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "align-items-center");

            const itemNumber = document.createElement("span");
            itemNumber.classList.add("badge", "list-number", "rounded-pill");
            itemNumber.textContent = `${counter}. `;
            itemNumber.style.marginRight = "1rem";

            const itemContent = document.createElement("div");
            itemContent.classList.add("ms-2", "me-auto");

            const itemTitle = document.createElement("div");
            itemTitle.classList.add("item-title");
            itemTitle.textContent = nome;

            const itemDescription = document.createElement("div");
            itemDescription.classList.add("item-description");
            itemDescription.textContent = profissao;

            const substituirButton = document.createElement("button");
            substituirButton.classList.add("btn", "substitute-button");
            substituirButton.textContent = "Substituir";
            substituirButton.addEventListener("click", () => {
                
                /*  //The code below substitute the jurado in the list with a new one. We're not gonna use it directly in the new implementation, but it is kept here for reference.
                const tipoJurado = listContainer.id === "titularesList" ? "titular" : "suplente";
                const newJurado = sortearJurado(tipoJurado);
                if (newJurado) {
                    updateJuradoInList(newJurado, listItem, counter, numero);
                } */

                
            });

            itemContent.appendChild(itemTitle);
            itemContent.appendChild(itemDescription);
            listItem.appendChild(itemNumber);
            listItem.appendChild(itemContent);
            listItem.appendChild(substituirButton);

            // Insert the new item at the top of the list
            listContainer.insertBefore(listItem, listContainer.firstChild);
        }

        function updateJuradoInList(jurado, listItem, counter, oldNumero) {
            const [numero, { nome, profissao }] = jurado;

            const itemNumber = listItem.querySelector(".badge");
            itemNumber.textContent = `${counter}. `;

            const itemTitle = listItem.querySelector(".item-title");
            itemTitle.textContent = nome;

            const itemDescription = listItem.querySelector(".item-description");
            itemDescription.textContent = profissao;

            // Update sortedJurados array
            const index = sortedJurados.indexOf(oldNumero);
            if (index !== -1) {
                sortedJurados.splice(index, 1);
            }

            // Update juradosTitulares
            if (juradosTitulares.hasOwnProperty(oldNumero)) {
                delete juradosTitulares[oldNumero];
                return null
            }

            // Update juradosSuplentes
            if (juradosSuplentes.hasOwnProperty(oldNumero)) {
                delete juradosSuplentes[oldNumero];
                return null
            }
        }


        //Logic for the "allAtOnce" and "onePerClick" sorting methods
        if (formaSorteio === "allAtOnce") {
            for (let i = 0; i < quantidadeJuradosTitulares; i++) {
                const jurado = sortearJurado("titular");
                if (jurado) {
                    addJuradoToList(jurado, titularesListContainer, titularesCounter++);
                }
            }

            for (let i = 0; i < quantidadeJuradosSuplentes; i++) {
                const jurado = sortearJurado("suplente");
                if (jurado) {
                    addJuradoToList(jurado, suplentesListContainer, suplentesCounter++);
                }
            }

            // Invert the order of the list items
            reverseListOrder(titularesListContainer);
            reverseListOrder(suplentesListContainer);
        }

        // Action buttons
        const realizarSorteioButton = document.createElement("button");
        realizarSorteioButton.classList.add("btn", "btn-primary", "mb-3");
        realizarSorteioButton.textContent = formaSorteio === "onePerClick" ? "Sortear próximo jurado" : "Homologar sorteio: gerar relatório de jurados";

        const voltarButton = document.createElement("button");
        voltarButton.classList.add("btn", "btn-secondary", "mb-3");
        voltarButton.textContent = "Voltar: alterar configurações de sorteio";

        realizarSorteioButton.addEventListener("click", (event) => {
            event.preventDefault();

            if (formaSorteio === "onePerClick") {
                if (titularesCounter <= quantidadeJuradosTitulares) {
                    let jurado = sortearJurado("titular");
                    if (jurado) {
                        addJuradoToList(jurado, titularesListContainer, titularesCounter++);
                    }
                } else if (suplentesCounter <= quantidadeJuradosSuplentes) {
                    let jurado = sortearJurado("suplente");
                    if (jurado) {
                        addJuradoToList(jurado, suplentesListContainer, suplentesCounter++);
                    }
                }

                if (titularesCounter > quantidadeJuradosTitulares && suplentesCounter > quantidadeJuradosSuplentes) {
                    realizarSorteioButton.textContent = "Homologar sorteio: gerar relatório de jurados";
                    reverseListOrder(titularesListContainer);
                    reverseListOrder(suplentesListContainer);
                    formaSorteio = "allAtOnce";
                }
            } else {

                // Stringify the generated data
                console.log(JSON.stringify(sortedJurados));
                console.log(JSON.stringify(juradosTitulares));
                console.log(JSON.stringify(juradosSuplentes));
                console.log(JSON.stringify(jurados));


                //Save cookies
                generateCookies(jurados, "jurados");
                generateCookies(sortedJurados, "sortedJurados");
                generateCookies(juradosTitulares, "juradosTitulares");
                generateCookies(juradosSuplentes, "juradosSuplentes");


                //Configures a printing version of the page
                const printArea = document.createElement("div");
                printArea.id = "printArea";

                const header = document.getElementById("title-bar")?.cloneNode(true);
                if (header) {
                    printArea.appendChild(header);
                }

                const cloneContent = contentDiv.cloneNode(true);
                printArea.appendChild(cloneContent);

                document.body.appendChild(printArea);
                window.print();
                document.body.removeChild(printArea);
            }
        });

        voltarButton.addEventListener("click", (event) => {
            event.preventDefault();
            screenControl = 2; // Update screenControl
            loadScreen(); // Reload the screen
        });

        const backRow = document.createElement("div");
        backRow.classList.add("row", "action-row");

        const backCol = document.createElement("div");
        backCol.classList.add("col-12");

        const nextRow = document.createElement("div");
        nextRow.classList.add("row", "action-row");

        const nextCol = document.createElement("div");
        nextCol.classList.add("col-12");

        backCol.appendChild(voltarButton);
        backRow.appendChild(backCol);

        nextCol.appendChild(realizarSorteioButton);
        nextRow.appendChild(nextCol);

        actionDiv.appendChild(nextRow);
        actionDiv.appendChild(backRow);

        // Page building
        const titleRow = document.createElement("div");
        titleRow.classList.add("row", "text-row");

        const titleCol = document.createElement("div");
        titleCol.classList.add("col-12");

        //titleCol.appendChild(horizontalRule);
        titleCol.appendChild(title);
        titleRow.appendChild(titleCol);
        contentDiv.appendChild(titleRow);
        contentDiv.appendChild(contentRow);
    }

    function reverseListOrder(listContainer) {
        const items = Array.from(listContainer.children);
        items.reverse().forEach(item => listContainer.appendChild(item));
    }



    function generateReportsAndSaveCookies() {
        // Generate cookies and reports logic here
    }



}

function generateCookies(cookieData, cookieName) {
    const cookieValue = JSON.stringify(cookieData);
    const expirationDays = 365; // Cookie expiration in days
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

function getJuradosTitulares(sortedJurados) {

}

document.addEventListener("DOMContentLoaded", loadScreen);