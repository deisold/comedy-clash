import { Request, Response } from 'express';
import { ShowCreationPayload, validateShowCreation } from "./data/ShowCreationPayload.js";
import { StatusCodes } from 'http-status-codes';
import { ShowUpdateRequestBody } from './data/ShowUpdateRequestBody.js';
import { ShowServiceType } from '../service/ShowService.js';
import { getImageBase64 } from '../utils/imageUtils.js';
//
export class ShowController {
    constructor(private showService: ShowServiceType) { }

    getShow = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: "Entity ID is required" });
            return;
        }
        try {
            console.log(`ShowController::getShow ${id}`);
            const show = await this.showService.getShow(id);
            if (!show) {
                console.log(`ShowControlle::getShow ${id} not found`);
                res.status(StatusCodes.NOT_FOUND).json({ error: "Show not found" });
                return;
            } else {
                console.log(`ShowControlle::getShow ${id} found`);
                res.status(StatusCodes.OK).json(show);
            }
        } catch (error) {
            console.error(`ShowControlle::getShow ${id} error: ${error}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to get show" });
        }
    }

    createShow = async (req: Request & { body: ShowCreationPayload }, res: Response) => {
        console.log("ShowController::createShow Received body:", req.body);  // txHash, description, etc.
        //
        const showRequestData = req.body as ShowCreationPayload;
        console.log(`ShowController::createShow txHash=${showRequestData.txHash}, file name=${req.file?.originalname}`);

        if (!validateShowCreation(showRequestData)) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid show creation payload" });
            return;
        }
        try {
            const image = req.file?.buffer;
            const imageMimeType = req.file?.mimetype;
            const show = await this.showService.createShow(showRequestData.description, showRequestData.txHash, image, imageMimeType);
            res.status(StatusCodes.CREATED).json(show);
        } catch (error) {
            console.error(`ShowController::createShow txHash=${showRequestData.txHash} error: ${error}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to create show" });
        }
    }

    uploadImage = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: "Entity ID is required" });
            return;
        }
        try {
            const image = req.file;
            if (!image) {
                res.status(400).json({ error: "No image provided" });
                return;
            }
            // Convert file to Base64 for Cloudinary
            const imageBase64 = getImageBase64(image)!!;
            const show = await this.showService.uploadImage(id, image.originalname, imageBase64);

            console.log(`ShowController::uploadImage ${id} show: ${show}`);
            res.status(StatusCodes.CREATED).json(show);
        } catch (error) {
            console.error(`ShowController::uploadImage ${id} error: ${error}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to upload image" });
        }
    }

    updateShow = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: "Entity ID is required" });
            return;
        }
        const showRequestData = req.body as ShowUpdateRequestBody;
        try {
            const show = await this.showService.updateShow(id,
                showRequestData.description, showRequestData.imageUrl
            );
            if (!show) {
                res.status(StatusCodes.NOT_FOUND).json({ error: "Show update not successful" });
                return;
            }
            res.status(StatusCodes.OK).json(show);
        } catch (error) {
            console.error(`ShowController::updateShow ${id} error: ${error}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update show" });
        }
    }


}