export function uploadExcel() {
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

export function downloadMockData() {
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
        "endereco", 
        "escolaridade",
        "profissao",
        "nascimento"
    ];
    const columnIndices = {};

    for (let i = 0; i < headerRow.length; i++) {
        const header = normalizeString(headerRow[i]);
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
        const numero = row[columnIndices["numero"]];
        const nome = row[columnIndices["nome"]];
        const profissao = row[columnIndices["profissao"]];

        if (numero && nome && profissao) {
            jurados[numero] = { nome, profissao };
        }
    }

    return jurados;
}