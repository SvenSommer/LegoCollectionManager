import CreatePusher from '../controllers/pushers/create';
import ShowAllPushers from '../controllers/pushers/show';
import ShowAllPushersBySorterid from '../controllers/pushers/showBySorter';
import UpdatePusherById from '../controllers/pushers/update';
import GetSinglePusherById from '../controllers/pushers/single';
import DeleteSinglePusherById from '../controllers/pushers/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Pusher
route.get(``, UserAuthMiddleware, ShowAllPushers);
//List all Pusher by Sorterid
route.get(`/sorter/:sorterid`, UserAuthMiddleware, ShowAllPushersBySorterid);
//Create a new Pusher
route.post(``, AdminAuthMiddleware, CreatePusher);
//Show info about a specific Pusher
route.get(`/:id`, UserAuthMiddleware, GetSinglePusherById);
//Update a particular Pusher
route.put(`/:id`, AdminAuthMiddleware, UpdatePusherById);
//Delete a particular Pusher
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePusherById);
export default route;