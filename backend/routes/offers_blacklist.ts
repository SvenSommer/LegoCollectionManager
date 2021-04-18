import CreateBlacklistWord from '../controllers/offers/blacklist/create';
import ShowAllBlacklistWords from '../controllers/offers/blacklist/show';
import UpdateBlacklistWordById from '../controllers/offers/blacklist/update';
import GetSingleBlacklistWordById from '../controllers/offers/blacklist/single';
import DeleteSingleBlacklistWordById from '../controllers/offers/blacklist/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all offer searchterms
route.get(``, UserAuthMiddleware, ShowAllBlacklistWords);
//Create a new offer searchterm
route.post(``, AdminAuthMiddleware, CreateBlacklistWord);
//Show info about a offer searchterm
route.get(`/:id`, UserAuthMiddleware, GetSingleBlacklistWordById);
//Update a particular offer searchterm
route.put(`/:id`, AdminAuthMiddleware, UpdateBlacklistWordById);
//Delete a particular offer searchterm
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleBlacklistWordById);

export default route;