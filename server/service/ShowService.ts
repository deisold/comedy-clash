import { Show } from "../reposity/data/Show.js";
import { ShowRepositoryType } from "../reposity/ShowRepositoryType.js";
import { v2 as cloudinary } from 'cloudinary';
import { ShowServiceType } from "./ShowServiceType.js";
//
export const ShowService = (showRepository: ShowRepositoryType): ShowServiceType => {
    const getShow = async (id: string) => {
        return showRepository.getShow(id);
    }

    const createShow = async (show: Show) => {
        return showRepository.createShow(show);
    }

    const uploadImage = async (id: string, imageName: string, fileBase64: string) => {
        const show = await showRepository.getShow(id);
        if (!show) {
            throw new Error(`uploadImage:Show not found: ${id}`);
        }
        let result: any;
        try {
            // Upload to Cloudinary
            console.log(`ShowService::uploading Image for show ${id}`);
            result = await cloudinary.uploader.upload(fileBase64, {
                folder: "shows",
                resource_type: "image",
            });
            console.log(`ShowService::uploadImage done ${id} secure_url: ${result.secure_url}`);
            console.log(`ShowService::uploadImage done ${id} imageUrl: ${result.imageUrl}`);

        } catch (error) {
            throw new Error(`uploadImage: Failed to upload image ${imageName} for show ${id}: ${error}`);
        }

        const updatedShow: Show = {
            ...show,
            imageUrl: result.secure_url
        }
        return showRepository.updateShow(id, updatedShow);
    }

    const updateShow = async (id: string, description: string, imageUrl: string | null) => {
        const show = await showRepository.getShow(id);
        if (!show) {
            throw new Error(`uploadImage: Show not found: ${id}`);
        }
        const updatedShow: Show = {
            ...show,
            description: description,
            imageUrl: imageUrl
        }

        return showRepository.updateShow(id, updatedShow);
    }

    const deleteShow = async (id: string) => {
        return showRepository.deleteShow(id);
    }

    return {
        getShow,
        createShow,
        uploadImage,
        updateShow,
        deleteShow
    }
}