import CreateLog from '../controllers/offers/logs/create';
import ShowAllLogs from '../controllers/offers/logs/show';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Log
route.get(``, UserAuthMiddleware, ShowAllLogs);
//Create a new Log
route.post(``, AdminAuthMiddleware, CreateLog);
export default route;