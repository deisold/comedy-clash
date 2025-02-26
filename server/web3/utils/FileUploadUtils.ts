import { v2 as cloudinary } from 'cloudinary';

export type UploadFileUtilsType = {
    // Upload a file to Cloudinary and return the secure URL
    uploadFile: (jobId: string | number | undefined, file: string, folder: string) => Promise<string>;
}

export const UploadFileUtils = (): UploadFileUtilsType => {
    const uploadFile = async (jobId: string | number | undefined, file: string, folder: string) => {
        console.log(`uploadFileUtils::uploadFile jobId: ${jobId}, folder: ${folder}`);
        try {
            const result = await cloudinary.uploader.upload(file, {
                folder: folder,
                resource_type: "image",
            });
            return result.secure_url;
        } catch (error) {
            throw new Error(`uploadFile: Failed to upload file jobId: ${jobId}, error msg: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    return {
        uploadFile
    }
}
