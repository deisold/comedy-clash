// import type { Provider, WebSocketProvider } from "@ethersproject/providers";
import { BlockchainTxDBModelType } from "../database/model/BlockchainTxDB";
import { TxStatus } from "../database/model/TxStatus";
import { ethers } from "ethers";
import { WebSocketProvider, Provider } from "@ethersproject/providers";
import { ContractTxConfirmationJobData, FileUploadJobData, GenericJobData } from "../jobqueue/JobData";
import { Queue as BullQueue } from "bull";
import { generateRandomHash } from "./utils/web3";
import mongoose from 'mongoose';
import fs from 'fs';
import WebSocket from 'ws';
//
export type ComedyTheaterEventObserverType = {
    startObserving: () => Promise<void>;
    stopObserving: () => void;
}

export const ComedyTheaterEventObserver = (
    contractAddress: string,
    getProvider: () => Promise<Provider>,
    jobQueue: BullQueue<GenericJobData>
): ComedyTheaterEventObserverType => {
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 5000; // 5 seconds
    let ws: WebSocket | null = null;
    let contract: ethers.Contract | null = null;
    //
    async function listenToContractEvents(contract: ethers.Contract) {
        console.log(`📜 ComedyTheaterEventObserver: Listening to contract events for contract: ${contract.address}`);
        contract.on('ShowCreated', (showAddress: string, event: ethers.Event) => {
            const txHash = event.transactionHash;
            const blockNumber = event.blockNumber;
            console.log(`📩 ComedyTheaterEventObserver: Show created at: ${showAddress} with txHash: ${txHash} at blockNumber: ${blockNumber}`);
            
            launchContractTxConfirmationJob(txHash, showAddress, jobQueue);
            launchFileUploadJob(txHash, jobQueue);
        });
    }
    async function getPastEvents(contract: ethers.Contract) {
        console.log(`📜 ComedyTheaterEventObserver: Getting past events for contract: ${contract.address}`);
        const filter = contract.filters.ShowCreated();

        const logs = await contract.queryFilter(filter, 0, "latest");
        console.log(`📜 ComedyTheaterEventObserver: Found ${logs.length} past events`);
        // 
        logs.forEach((log) => {
            const txHash = log.transactionHash;
            const showAddress = log.args?.showAddress;
            const blockNumber = log.blockNumber;
            console.log(`📩 ComedyTheaterEventObserver: Show created at: ${showAddress} with txHash: ${txHash} at blockNumber: ${blockNumber}`);
        });
    }

    async function afterWebSocketOpened(provider: Provider) {
        const contractJson = JSON.parse(fs.readFileSync("./web3/utils/ComedyTheater.json", "utf-8"));
        const abi = contractJson.abi; // Extract only the ABI
        contract = new ethers.Contract(contractAddress, abi, provider);

        // Handle errors
        provider.on("error", (error) => {
            console.error("ComedyTheaterEventObserver: Provider error:", error);
        });

        contract.on("error", (error) => {
            console.error("ComedyTheaterEventObserver: Contract error:", error);
        });

        // getPastEvents(contract);
        listenToContractEvents(contract);
    }

    async function reconnect() {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.error("❌ ComedyTheaterEventObserver: Max reconnection attempts reached");
            return;
        }
        reconnectAttempts++;
        console.log(`🔄 ComedyTheaterEventObserver: Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

        setTimeout(async () => {
            try {
                await startObserving();
            } catch (error) {
                console.error("❌ ComedyTheaterEventObserver: Reconnection failed:", error);
                await reconnect();
            }
        }, RECONNECT_DELAY);
    }

    async function startObserving() {
        console.log(`ComedyTheaterEventObserver: Starting to observe ComedyTheater events (address=${contractAddress})`);
        const provider = await getProvider();
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.name);

        if (ws === null || ws.readyState !== WebSocket.OPEN) {
            ws = (provider as WebSocketProvider).websocket as unknown as WebSocket;
            await new Promise<void>((resolve) => {
                ws!.onopen = () => {
                    console.log("✅ ComedyTheaterEventObserver: WebSocket opened. State:", ws!.readyState);
                    resolve();
                };
            });
            afterWebSocketOpened(provider);
        } else {
            console.log("✅ ComedyTheaterEventObserver: WebSocket already opened. State:", ws.readyState);
            afterWebSocketOpened(provider);
        }
        ws!.onerror = async (error) => {
            console.error("❌ ComedyTheaterEventObserver: WebSocket Error:", error);
            await reconnect();
        };
    }

    function stopObserving() {
        console.log(`🔴 ComedyTheaterEventObserver: Stopping to observe ComedyTheater events`);
        contract?.removeAllListeners();
        ws?.close();
        ws = null;
    }

    return {
        startObserving,
        stopObserving
    }
}

const launchContractTxConfirmationJob = (txHash: string, contractAddress: string, jobQueue: BullQueue<GenericJobData>) => {
    const jobData: ContractTxConfirmationJobData = {
        txHash: txHash,
        contractAddress: contractAddress,
        status: TxStatus.CONFIRMED
    };
    // Launch contract tx confirmation job
    console.log(`ComedyTheaterEventObserver: Adding job to queue: ${jobData.txHash}`);
    jobQueue.add({
        type: 'contractTxConfirmation',
        data: jobData
    });
}
const launchFileUploadJob = (txHash: string, jobQueue: BullQueue<GenericJobData>) => {
    const fileUploadJobData: FileUploadJobData = {
        txHash: txHash,
    };
    // Launch file upload job
    console.log(`ComedyTheaterEventMockObserver: Adding job to queue: ${fileUploadJobData.txHash}`);
    jobQueue.add({
        type: 'fileUpload',
        data: fileUploadJobData
    });
}

export const ComedyTheaterEventMockObserver = (
    blockchainTxDB: BlockchainTxDBModelType, jobQueue: BullQueue<GenericJobData>
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
                const newPendingDocs = await blockchainTxDB.find(query).sort({ _id: 1 }).exec();

                if (newPendingDocs.length > 0) {
                    console.log(`ComedyTheaterEventMockObserver: Found ${newPendingDocs.length} new documents`);
                    // Update the last checked ID
                    lastCheckedId = newPendingDocs[newPendingDocs.length - 1]._id.toString();

                    // Process each new document
                    for (const data of newPendingDocs) {
                        const contractAddress = generateRandomHash();
                        console.log(`ComedyTheaterEventMockObserver: New blockchainTxDB data inserted: ${data.txHash}, contractAddress=${contractAddress}`);
                        launchContractTxConfirmationJob(data.txHash, contractAddress, jobQueue);
                        launchFileUploadJob(data.txHash, jobQueue);
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