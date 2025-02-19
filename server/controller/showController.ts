import { Request, Response } from 'express';
import { ShowServiceType } from "../service/ShowServiceType.js";
import { ShowRequestBody } from "./data/ShowRequestBody.js";
import { StatusCodes } from 'http-status-codes';
import { ShowUpdateRequestBody } from './data/ShowUpdateRequestBody.js';
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

    createShow = async (req: Request & { body: ShowRequestBody }, res: Response) => {
        const showRequestData = req.body as ShowRequestBody;
        try {
            console.log(`ShowController::createShow ${showRequestData.id}`);
            const show = await this.showService.createShow(showRequestData);
            res.status(StatusCodes.CREATED).json(show);
        } catch (error) {
            console.error(`ShowController::createShow ${showRequestData.id} error: ${error}`);
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
            const fileBase64 = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
            const show = await this.showService.uploadImage(id, image.originalname, fileBase64);

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