// import type { Provider, WebSocketProvider } from "@ethersproject/providers";
import { BlockchainTxDBModelType } from "../database/model/BlockchainTxDB";
import { TxStatus } from "../database/model/TxStatus";
import { ComedyTheater__factory, ComedyTheater } from "./utils/types"
import { WebSocketProvider, Provider } from "ethers";
import { ContractTxConfirmationJobData, GenericJobData } from "../jobqueue/JobData";
import { Queue as BullQueue } from "bull";
import { generateRandomHash } from "./utils/web3";
import mongoose from 'mongoose';
//

export type ComedyTheaterEventObserverType = {
    startObserving: () => Promise<void>;
    stopObserving: () => void;
}

export const ComedyTheaterEventObserver = (
    contractAddress: string,
    getProvider: () => Promise<Provider>
): ComedyTheaterEventObserverType => {
    var comedyTheater: ComedyTheater | null = null;

    async function startObserving() {
        console.log(`ComedyTheaterEventObserver: Starting to observe ComedyTheater events (address=${contractAddress})`);
        const provider = await getProvider();
        const comedyTheater = ComedyTheater__factory.connect(contractAddress, provider);

        const ws = (provider as WebSocketProvider).websocket as unknown as WebSocket; //
        ws.onopen = () => {
            console.log("WebSocket opened. State:", ws.readyState);

            comedyTheater.on(comedyTheater.getEvent('ShowCreated'), (address, event) => {
                console.log(`ComedyTheaterEventObserver: Show tx confirmed: ${address}`);
            });
        };
        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    }
    function stopObserving() {
        console.log(`ComedyTheaterEventObserver: Stopping to observe ComedyTheater events`);
        comedyTheater?.removeAllListeners();
    }

    return {
        startObserving,
        stopObserving
    }
}

export const ComedyTheaterEventMockObserver = (
    blockchainTxDB: BlockchainTxDBModelType,
    jobQueue: BullQueue<GenericJobData>
): ComedyTheaterEventObserverType => {

    let isObserving = false;
    let intervalId: NodeJS.Timeout | null = null;
    let lastCheckedId: string | null = null;

    async function startObserving() {
        console.log(`ComedyTheaterEventMockObserver: Starting to observe ComedyTheater events`);
        isObserving = true;

        // Set up polling interval (e.g., check every 2 seconds)
        intervalId = setInterval(async () => {
            if (!isObserving) return;

            try {
                // Query for new documents since last check
                const query = lastCheckedId
                    ? { _id: { $gt: new mongoose.Types.ObjectId(lastCheckedId) }, status: TxStatus.PENDING }
                    : { status: TxStatus.PENDING };
                const newDocs = await blockchainTxDB.find(query).sort({ _id: 1 }).exec();

                if (newDocs.length > 0) {
                    console.log(`ComedyTheaterEventMockObserver: Found ${newDocs.length} new documents`);
                    // Update the last checked ID
                    lastCheckedId = newDocs[newDocs.length - 1]._id.toString();

                    // Process each new document
                    for (const data of newDocs) {
                        console.log(`ComedyTheaterEventMockObserver: New blockchainTxDB data inserted: ${data.txHash}`);

                        if (data.status === TxStatus.PENDING) {
                            const jobData: ContractTxConfirmationJobData = {
                                txHash: data.txHash,
                                contractAddress: generateRandomHash(),
                                status: TxStatus.CONFIRMED
                            };
                            console.log(`ComedyTheaterEventMockObserver: Adding job to queue: ${jobData.txHash}`);
                            jobQueue.add({
                                type: 'contractTxConfirmation',
                                data: jobData
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error polling for new documents:", error);
            }
        }, 2000); // Poll every 2 seconds
    }

    function stopObserving() {
        console.log(`ComedyTheaterEventMockObserver: Stopping observation of ComedyTheater events`);
        isObserving = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    return {
        startObserving,
        stopObserving
    }
}