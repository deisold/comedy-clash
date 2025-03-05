import express from 'express';
import { ShowControllerType } from '../controller/showController';
import { ShowControllerMockType } from '../controller/showControllerMock';
import multer from 'multer';

// Configure Multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

export interface ShowRoutesType {
    bind: () => express.Router;
}

export const ShowRoutes = (showController: ShowControllerType, router: express.Router): ShowRoutesType => {
    const bind = () => {
        console.log(`ShowRoutes::getRoutes setting up routes`);
        //
        router.post('/shows', upload.single('image'), showController.createShow);
        router.get('/shows/:id', showController.getShow);
        router.put('/shows/:id', showController.updateShow);
        router.post('/shows/:id/upload-image', upload.single('image'), showController.uploadImage);
        //
        return router;
    }

    return {
        bind,
    }
}

export const ShowRoutesForMock = (showControllerMock: ShowControllerMockType, router: express.Router): ShowRoutesType => {
    const bind = () => {
        console.log(`ShowRoutesForMock::getRoutes setting up routes`);
        //
        router.post('/shows/:id/confirmtx', showControllerMock.confirmTx);
        //
        return router;
    }

    return {
        bind,
    }
}