export async function imageFileToBase64(file: File | null): Promise<string | null> {
    try {
        if (!file) {
            return null;
        }

        const buffer = await file.arrayBuffer();
        if (!buffer.byteLength) {
            return null;
        }

        const base64 = Buffer.from(buffer).toString('base64');
        return `data:${file.type};base64,${base64}`;
    } catch (error) {
        console.error('Error converting File to Base64:', error);
        return null;
    }
}