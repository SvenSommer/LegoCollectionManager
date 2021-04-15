import ShowProgressDetailsController from '../controllers/progressdetails/showbyrequestids';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
import AdminAuthMiddleware from '../controllers/middleware/AdminAuth.middleware';
const route = Router();

//List all ValveController
route.get(`/:id`, UserAuthMiddleware, ShowProgressDetailsController);
//Delete a particular ValveController
export default route;