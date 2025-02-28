import { Show } from "../reposity/data/Show.js";
import { v2 as cloudinary } from 'cloudinary';
import { BlockchainTxRepositoryType } from "../reposity/BlockchainTxRepository.js";
import { AuthStoreType } from "../store/AuthStore.js";
import { TxStatus } from "../database/model/TxStatus.js";
import { ShowCreationPayload, fromShowRequest } from "../controller/data/ShowCreationPayload.js";
import { ShowRepositoryType } from "../reposity/ShowRepository.js";
//
export interface ShowServiceType {
    getShow: (id: string) => Promise<Show | null>;
    createShow: (description: string, txHash: string, image: Buffer | undefined, imageMimeType: string | undefined  ) => Promise<Show>;
    uploadImage: (id: string, imageName: string, imageBase64: string) => Promise<Show>;
    updateShow: (id: string, description: string, imageUrl: string | null) => Promise<Show>;
    deleteShow: (id: string) => Promise<void>;
}
//
export const ShowService = (showRepository: ShowRepositoryType,
    blockchainTxRepository: BlockchainTxRepositoryType,
    authStore: AuthStoreType,
): ShowServiceType => {

    const getShow = async (id: string) => {
        return showRepository.getShow(id);
    }

    const createShow = async (description: string, txHash: string, imageBuffer: Buffer | undefined, imageMimeType: string | undefined) => {
        const authUser = authStore.getUser();
        if (!authUser) {
            throw new Error("Auth user not found");
        }
        console.log(`ShowService::createShow txHash=${txHash}, image=${imageBuffer?.length} bytes`);
        // Create the pending blockchain transaction entry
        const blockchainTxPromise = blockchainTxRepository.createBlockchainTx({
            txHash: txHash,
            status: TxStatus.PENDING,
            image: imageBuffer,
            imageMimeType: imageMimeType,
            walletAddress: authUser.walletAddress,
            userId: authUser.userId,
            timestamp: new Date()
        });

        // Create the show entry
        const show: Show = fromShowRequest({
            description: description,
            txHash: txHash,
            id: txHash, // temporary id
            txStatus: TxStatus.PENDING,
            userId: authUser.userId
        });
        const showPromise = showRepository.createShow(show);
        const [blockchainTx, createdShow] = await Promise.all([blockchainTxPromise, showPromise]);
        const { image, ...logData } = blockchainTx;
        console.log(`ShowService::createShow createdShow=${JSON.stringify(createdShow)}`);
        console.log(`ShowService::createShow blockchainTx=${JSON.stringify(logData)}, image=${imageBuffer?.length} bytes`);
 
        return createdShow;
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