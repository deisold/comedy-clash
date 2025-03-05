import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ShowServiceType } from '../service/ShowService.js';
import { TxStatus } from '../database/model/TxStatus.js';
import { GenericJobData } from '../jobqueue/JobData.js';
import { Queue as BullQueue } from "bull"; 
import { generateRandomHash } from '../web3/utils/web3.js';
import { launchFileUploadJob, launchContractTxConfirmationJob } from '../web3/ComedyTheaterEventObserver.js';
//
export interface ShowConfirmTxPayload {
    txHash: string;
}

export type ShowControllerMockType = {
    confirmTx: (req: Request, res: Response) => Promise<void>;
}

export const ShowControllerMock = (showService: ShowServiceType, jobQueue: BullQueue<GenericJobData>): ShowControllerMockType => {
    const confirmTx = async (req: Request, res: Response) => {
        console.log(`ShowController::confirmTx for show id=${req.params.id} and body: ${req.body}`);  // txHash, description, etc.

        const id = req.params.id;
        const showConfirmTxPayload = req.body as ShowConfirmTxPayload;
        const txHash = showConfirmTxPayload.txHash;
        if (!id || !txHash) {
            res.status(400).json({ error: "Entity ID and txHash are required" });
            return;
        }
        try {
            console.log(`ShowControllerMock::confirmTx ${id}`);
            const show = await showService.getShow(id);
            if (!show) {
                console.log(`ShowControllerMock::confirmTx no show found for id=${id}`);
                res.status(StatusCodes.NOT_FOUND).json({ error: "Show not found" });
                return;
            }
            console.log(`ShowControllerMock::confirmTx ${id} found`);
            if (show.txStatus === TxStatus.PENDING) {
                res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: "Show not found" });
                return;
            }

            const contractAddress = generateRandomHash();
            console.log(`ShowControllerMock: New blockchainTxDB data inserted: ${txHash}, contractAddress=${contractAddress}`);
            launchContractTxConfirmationJob(txHash, contractAddress, jobQueue);
            launchFileUploadJob(txHash, jobQueue);

            res.status(StatusCodes.OK);

        } catch (error) {
            console.error(`ShowControllerMock::confirmTx ${id} error: ${error}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to confirm tx" });
        }
    }

    return {
        confirmTx
    }
}
