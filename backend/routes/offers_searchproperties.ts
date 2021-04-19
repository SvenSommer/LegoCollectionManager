import CreateOfferSearchpropertiy from '../controllers/offers/searchproperties/create';
import ShowAllOfferSearchproperties from '../controllers/offers/searchproperties/show';
import UpdateOfferSearchpropertiyById from '../controllers/offers/searchproperties/update';
import GetSingleOfferSearchpropertiyById from '../controllers/offers/searchproperties/single';
import DeleteSingleOfferSearchpropertiyById from '../controllers/offers/searchproperties/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all offer searchterms
route.get(``, UserAuthMiddleware, ShowAllOfferSearchproperties);
//Create a new offer searchterm
route.post(``, AdminAuthMiddleware, CreateOfferSearchpropertiy);
//Show info about a offer searchterm
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferSearchpropertiyById);
//Update a particular offer searchterm
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferSearchpropertiyById);
//Delete a particular offer searchterm
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferSearchpropertiyById);

export default route;