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
import { getImageBuffer } from "../utils/imageUtils.js";
import { ComedyTheaterEventObserver, ComedyTheaterEventObserverType } from "../web3/ComedyTheaterEventObserver.js";
import { initWeb3Provider } from '../web3/utils/web3.js';
// Remove React imports and context creation
export interface ServerContextType {
    showRepository: ShowRepositoryType;
    showService: ShowServiceType;
    showController: ShowController;
    showRoutes: ShowRoutesType;
    authStore: AuthStoreType;
    comedyTheaterEventObserver: ComedyTheaterEventObserverType;
}

const router = express.Router();

// Create instances
const authStore: AuthStoreType = AuthStore();
//
const comedyTheaterContractAddress = process.env.COMEDY_THEATER_ADDRESS as string;
const comedyTheaterEventObserver: ComedyTheaterEventObserverType = ComedyTheaterEventObserver(
    comedyTheaterContractAddress, initWeb3Provider);
//
const showRepository: ShowRepositoryType = ShowRepository(ShowDB);
const blockchainTxRepository: BlockchainTxRepositoryType = BlockchainTxRepository(BlockchainTxDB);
const showService: ShowServiceType = ShowService(showRepository, blockchainTxRepository, authStore, getImageBuffer);
const showController: ShowController = new ShowController(showService);
const showRoutes: ShowRoutesType = ShowRoutes(showController, router);

// Export individual getters
export function getShowRepository() { return showRepository; }
export function getShowService() { return showService; }
export function getShowController() { return showController; }
export function getShowRoutes() { return showRoutes; }

// Export the context object if needed
export const useServerContext: ServerContextType = {
    showRepository,
    showService,
    showController,
    showRoutes,
    authStore,
    comedyTheaterEventObserver
};