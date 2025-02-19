import { ShowRepository } from "../reposity/ShowReposity.js";
import { ShowRepositoryType } from "../reposity/ShowRepositoryType.js";
import ShowDB from "../database/model/ShowDB.js";
import { ShowService } from "../service/ShowService.js";
import { ShowServiceType } from "../service/ShowServiceType.js";
import { ShowController } from "../controller/showController.js";
import { ShowRoutes, ShowRoutesType } from "../routes/showRoutes.js";
import express from 'express';

// Remove React imports and context creation
export interface ServerContextType {
    showRepository: ShowRepositoryType;
    showService: ShowServiceType;
    showController: ShowController;
    showRoutes: ShowRoutesType;
}

const router = express.Router();

// Create instances
const showRepository: ShowRepositoryType = ShowRepository(ShowDB);
const showService: ShowServiceType = ShowService(showRepository);
const showController: ShowController = new ShowController(showService);
const showRoutes: ShowRoutesType = ShowRoutes(showController, router);

// Export individual getters
export function getShowRepository() { return showRepository; }
export function getShowService() { return showService; }
export function getShowController() { return showController; }
export function getShowRoutes() { return showRoutes; }

// Export the context object if needed
export const serverContext: ServerContextType = {
    showRepository,
    showService,
    showController,
    showRoutes,
};