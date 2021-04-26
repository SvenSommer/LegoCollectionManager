import ShowAllPricedata from '../controllers/pricedata/show';
import GetSinglePricedataById from '../controllers/pricedata/single';
import DeleteSinglePriceDataById from '../controllers/pricedata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Pricedata
route.get(``, UserAuthMiddleware, ShowAllPricedata);
//Show info about a Pricedata
route.get(`/:id`, UserAuthMiddleware, GetSinglePricedataById);
//Delete a particular Pricedata
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePriceDataById);

export default route;