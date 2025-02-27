import express from 'express';
import { ShowRepository } from "../reposity/ShowRepository.js";
import { ShowRepositoryType } from "../reposity/ShowRepository.js";
import ShowDB from "../database/model/ShowDB.js";
import { ShowService, ShowServiceType } from "../service/ShowService.js";
import { ShowController } from "../controller/showController.js";
import { ShowRoutes, ShowRoutesType } from "../routes/showRoutes.js";
import { BlockchainTxRepository } from "../reposity/BlockchainTxRepository.js";
import { BlockchainTxRepositoryType } from "../reposity/BlockchainTxRepository.js";
import BlockchainTxDB from "../database/model/BlockchainTxDB.js";
import { AuthStore, AuthStoreType } from "../store/AuthStore.js";
import { ComedyTheaterEventMockObserver, ComedyTheaterEventObserver, ComedyTheaterEventObserverType } from "../web3/ComedyTheaterEventObserver.js";
import { initWeb3Provider } from '../web3/utils/web3.js';
import Queue from 'bull';
import { Queue as BullQueue } from 'bull';
import { GenericJobData } from '../jobqueue/JobData.js';
import { ContractTxConfirmationJobProcessor, ContractTxConfirmationJobProcessorType } from '../jobqueue/processor/ContractTxConfirmationJobProcessor.js';
import { JobQueueProcessor, JobQueueProcessorType } from '../jobqueue/JobProcessor.js';
import { UploadFileUtils, UploadFileUtilsType } from '../web3/utils/FileUploadUtils.js';
import { FileUploadJobProcessor, FileUploadJobProcessorType } from '../jobqueue/processor/FileUploadJobProcessor.js';
import { WebSocketServerType } from '../websocket/WebSocketServer.js';
import { NotificationJobProcessor, NotificationJobProcessorType } from '../jobqueue/processor/NotificationJobProcessor.js';
//
export interface ServerContextType {
    showRepository: ShowRepositoryType;
    showService: ShowServiceType;
    showController: ShowController;
    showRoutes: ShowRoutesType;
    authStore: AuthStoreType;
    comedyTheaterEventObserver: ComedyTheaterEventObserverType;
    comedyTheaterEventMockObserver: ComedyTheaterEventObserverType;
    jobQueue: BullQueue<GenericJobData>;
    jobQueueProcessor: JobQueueProcessorType;
    get webSocketServerInstance(): WebSocketServerType;
}

let webSocketServerInstance: WebSocketServerType | null = null;

const router = express.Router();

const uploadFileUtils: UploadFileUtilsType = UploadFileUtils();

// JOB QUEUE
const jobQueue = new Queue<GenericJobData>('jobQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
        password: process.env.REDIS_PASSWORD
    }
});

// JOB PROCESSOR Setup
const contractTxConfirmationJobProcessor: ContractTxConfirmationJobProcessorType = ContractTxConfirmationJobProcessor(jobQueue,BlockchainTxDB, ShowDB);
const fileUploadJobProcessor: FileUploadJobProcessorType = FileUploadJobProcessor(jobQueue, BlockchainTxDB, ShowDB, uploadFileUtils);
const notificationJobProcessor: NotificationJobProcessorType = NotificationJobProcessor(() => getWebSocketServerInstance());
const jobQueueProcessor: JobQueueProcessorType = JobQueueProcessor(
    jobQueue, contractTxConfirmationJobProcessor, fileUploadJobProcessor, notificationJobProcessor
);
// Create instances
const authStore: AuthStoreType = AuthStore();
//
const comedyTheaterContractAddress = process.env.COMEDY_THEATER_ADDRESS as string;
const comedyTheaterEventObserver: ComedyTheaterEventObserverType = ComedyTheaterEventObserver(
    comedyTheaterContractAddress, initWeb3Provider);
const comedyTheaterEventMockObserver: ComedyTheaterEventObserverType = ComedyTheaterEventMockObserver(BlockchainTxDB, jobQueue);
//
const showRepository: ShowRepositoryType = ShowRepository(ShowDB);
const blockchainTxRepository: BlockchainTxRepositoryType = BlockchainTxRepository(BlockchainTxDB);
const showService: ShowServiceType = ShowService(showRepository, blockchainTxRepository, authStore);
const showController: ShowController = new ShowController(showService);
const showRoutes: ShowRoutesType = ShowRoutes(showController, router);

export function setWebSocketServerInstance(webSocketServerInstance: WebSocketServerType): void {
    webSocketServerInstance = webSocketServerInstance;
}

function getWebSocketServerInstance(): WebSocketServerType {
    if (!webSocketServerInstance) {
        throw new Error('WebSocket server instance not initialized');
    }
    return webSocketServerInstance;
};
// Export the context object if needed
export const useServerContext: ServerContextType = {
    showRepository,
    showService,
    showController,
    showRoutes,
    authStore,
    comedyTheaterEventObserver,
    comedyTheaterEventMockObserver,
    jobQueue,
    jobQueueProcessor,
    get webSocketServerInstance() {
        return getWebSocketServerInstance();
    }
};