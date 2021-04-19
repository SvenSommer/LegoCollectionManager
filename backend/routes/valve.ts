import CreateValveController from '../controllers/valves/create';
import ShowAllValveController from '../controllers/valves/show';
import ShowAllValveControllerBySorterid from '../controllers/valves/showBySorter';
import UpdateValveControllerById from '../controllers/valves/update';
import GetSingleValveControllerById from '../controllers/valves/single';
import DeleteSingleValveControllerById from '../controllers/valves/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all ValveController
route.get(``, UserAuthMiddleware, ShowAllValveController);
//List all ValveController by Sorterid
route.get(`/sorter/:sorterid`, UserAuthMiddleware, ShowAllValveControllerBySorterid);
//Create a new ValveController
route.post(``, AdminAuthMiddleware, CreateValveController);
//Show info about a specific ValveController
route.get(`/:id`, UserAuthMiddleware, GetSingleValveControllerById);
//Update a particular ValveController
route.put(`/:id`, AdminAuthMiddleware, UpdateValveControllerById);
//Delete a particular ValveController
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleValveControllerById);
export default route;