import express from 'express';
import { ShowRepository } from "../reposity/ShowRepository.js";
import { ShowRepositoryType } from "../reposity/ShowRepository.js";
import ShowDB from "../database/model/ShowDB.js";
import { ShowService, ShowServiceType } from "../service/ShowService.js";
import { ShowController, ShowControllerType } from "../controller/showController.js";
import { ShowRoutes, ShowRoutesForMock, ShowRoutesType } from "../routes/showRoutes.js";
import { BlockchainTxRepository } from "../reposity/BlockchainTxRepository.js";
import { BlockchainTxRepositoryType } from "../reposity/BlockchainTxRepository.js";
import BlockchainTxDB from "../database/model/BlockchainTxDB.js";
import { AuthStore, AuthStoreType } from "../store/AuthStore.js";
import { ComedyTheaterEventObserver, ComedyTheaterEventObserverType } from "../web3/ComedyTheaterEventObserver.js";
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
import { ShowControllerMock, ShowControllerMockType } from '../controller/showControllerMock.js';
//
export interface ServerContextType {
    showRepository: ShowRepositoryType;
    showService: ShowServiceType;
    showController: ShowControllerType;
    showRoutes: ShowRoutesType;
    showRoutesMock: ShowRoutesType;
    authStore: AuthStoreType;
    comedyTheaterEventObserver: ComedyTheaterEventObserverType;
    jobQueue: BullQueue<GenericJobData>;
    jobQueueProcessor: JobQueueProcessorType;
    setWebSocketServerInstance: (wssInstance: WebSocketServerType) => void;
    getWebSocketServerInstance: () => WebSocketServerType;
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


// Create instances
const authStore: AuthStoreType = AuthStore();
//
const comedyTheaterContractAddress = process.env.COMEDY_THEATER_ADDRESS as string;
const comedyTheaterEventObserver: ComedyTheaterEventObserverType = ComedyTheaterEventObserver(
    comedyTheaterContractAddress, initWeb3Provider, jobQueue);
// const comedyTheaterEventMockObserver: ComedyTheaterEventObserverType = ComedyTheaterEventMockObserver(BlockchainTxDB, jobQueue);
//
const showRepository: ShowRepositoryType = ShowRepository(ShowDB);
const blockchainTxRepository: BlockchainTxRepositoryType = BlockchainTxRepository(BlockchainTxDB);
const showService: ShowServiceType = ShowService(showRepository, blockchainTxRepository, authStore);
const showController: ShowControllerType = ShowController(showService);
const showControllerMock: ShowControllerMockType = ShowControllerMock(showService, jobQueue);
const showRoutes: ShowRoutesType = ShowRoutes(showController, router);
const showRoutesMock: ShowRoutesType = ShowRoutesForMock(showControllerMock, router);
// JOB PROCESSOR Setup
const contractTxConfirmationJobProcessor: ContractTxConfirmationJobProcessorType = ContractTxConfirmationJobProcessor(jobQueue, blockchainTxRepository, showRepository);
const fileUploadJobProcessor: FileUploadJobProcessorType = FileUploadJobProcessor(jobQueue, blockchainTxRepository, showRepository, uploadFileUtils);
const notificationJobProcessor: NotificationJobProcessorType = NotificationJobProcessor(getWebSocketServerInstance);
const jobQueueProcessor: JobQueueProcessorType = JobQueueProcessor(
    jobQueue, contractTxConfirmationJobProcessor, fileUploadJobProcessor, notificationJobProcessor
);

function getWebSocketServerInstance(): WebSocketServerType {
    if (!webSocketServerInstance) {
        console.error('🔴 NotificationJobProcessor: WebSocket server instance not initialized');
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
    showRoutesMock,
    authStore,
    comedyTheaterEventObserver,
    jobQueue,
    jobQueueProcessor,
    setWebSocketServerInstance: (wssInstance: WebSocketServerType) => {
        webSocketServerInstance = wssInstance;
    },
    getWebSocketServerInstance: () => {
        if (!webSocketServerInstance) {
            console.warn('⚠️ WebSocket server instance accessed before initialization');
            return null as unknown as WebSocketServerType; // Return null but cast to expected type
        }
        return webSocketServerInstance;
    }
};