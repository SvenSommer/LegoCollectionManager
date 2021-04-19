import ShowProgressDetailsController from '../controllers/progressdetails/showbyrequestids';
import CreateProgress from '../controllers/progressdetails/create';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
import AdminAuthMiddleware from '../controllers/middleware/AdminAuth.middleware';
const route = Router();


//Create a new progress entry
route.post(``, AdminAuthMiddleware, CreateProgress);
//Show latest Progress by id
route.get(`/:id`, UserAuthMiddleware, ShowProgressDetailsController);

export default route;