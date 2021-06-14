import ShowAllPurchasedItemsByOrderitemid from '../controllers/purchasedparts/single';
import UpsertPurchasedPart from '../controllers/purchasedparts/upsert';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();


//Show all infos by a purchased part
route.get(`/orderitemid/:orderitemid`, AdminAuthMiddleware, ShowAllPurchasedItemsByOrderitemid);
//Create or Update a a purchased part 
route.post(``, AdminAuthMiddleware, UpsertPurchasedPart);

export default route;