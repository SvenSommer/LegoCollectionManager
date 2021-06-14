import ShowAllOrders from '../controllers/orders/show';
import GetSingleOrderById from '../controllers/orders/single';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Order
route.get(``, AdminAuthMiddleware, ShowAllOrders);
//Show info about a Order
route.get(`/:id`, AdminAuthMiddleware, GetSingleOrderById);

export default route;