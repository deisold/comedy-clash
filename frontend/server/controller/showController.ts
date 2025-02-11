import { Request, Response } from 'express';
import { ShowServiceType } from "../service/ShowService.js";
import { ShowRequestBody } from "./data/ShowRequestBody.js";
import { StatusCodes } from 'http-status-codes';
//
export class ShowController {
    constructor(private showService: ShowServiceType) { }

    getShow = async (req: Request, res: Response) => {
        const showId = req.params.showId;
        try {
            console.log(`ShowController::getShow ${showId}`);
            const show = await this.showService.getShow(showId);
            if (!show) {
                console.log(`ShowControlle::getShow ${showId} not found`);
                res.status(StatusCodes.NOT_FOUND).json({ error: "Show not found" });
                return;
            } else {
                console.log(`ShowControlle::getShow ${showId} found`);
                res.status(StatusCodes.OK).json(show);
            }
        } catch (error) {
            console.error(`ShowControlle::getShow ${showId} error: ${error}`);
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
    // async getShow(req: Request & { body: ShowRequestBody }, res: Response) {
    //     try {
    //         const showRequestData = req.body as ShowRequestBody;
    //         console.log(`ShowControlle::getShow ${showRequestData.id}`);
    //         const show = await this.showService.getShow(showRequestData.id);
    //         if (!show) {
    //             console.log(`ShowControlle::getShow ${showRequestData.id} not found`);
    //             res.status(404).json({ error: "Show not found" });
    //             return;
    //         } else {
    //             console.log(`ShowControlle::getShow ${showRequestData.id} found`);
    //             res.status(200).json(show);
    //         }
    //     } catch (error) {
    //         res.status(500).json({ error: "Failed to get show" });
    //     }
    // }


}