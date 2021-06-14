import ShowAllOrderItemsByOrderid from '../controllers/orderitems/showByOrderId';
import ShowSingleOrderItemByid from '../controllers/orderitems/single';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//Show all infos by a Order
route.get(`/orderid/:orderid`, AdminAuthMiddleware, ShowAllOrderItemsByOrderid);

//Show  infos by id
route.get(`/:id`, AdminAuthMiddleware, ShowSingleOrderItemByid);

export default route;