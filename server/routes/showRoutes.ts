import express from 'express';
import { ShowController } from '../controller/showController';

export interface ShowRoutesType {
    bind: () => express.Router;
}

export const ShowRoutes = (showController: ShowController, router: express.Router): ShowRoutesType => {
    const bind = () => {
        console.log(`ShowRoutes::getRoutes: showController=${showController}`);
        router.route('/shows/:showId').get(showController.getShow);
        //
        router.route('/shows').post(showController.createShow);
        return router;
    }

    return {
        bind,
    }
}

