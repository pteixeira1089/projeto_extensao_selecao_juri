export class FilesUtils {
    /**
     * @param { string } filePath - The path to the file to be fetched
     * @returns { blob } - Returns the blob of a file in a given path
     */
    static async getBlob(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error("Não foi possível carregar o arquivo especificado.");
        }
        const blob = await response.blob();
        return blob;
    }
}