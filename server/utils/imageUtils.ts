export const getImageBuffer = (imageBlobBase64: string) => {
    try {
        return Buffer.from(imageBlobBase64, 'base64');
    } catch (error) {
        console.error(`Error getting image buffer: ${error}`);
        throw error;
    }
}

export const getImageBase64 = (image: Express.Multer.File | undefined): string | null => {
    if (!image) {
        return null;
    }
    const fileBase64 = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
    return fileBase64;
}