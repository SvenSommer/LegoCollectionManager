import CreateOfferStatus from '../controllers/offers/status/create';
import ShowAllOfferStatus from '../controllers/offers/status/show';
import UpdateOfferStatus from '../controllers/offers/status/update';
import GetSingleOfferStatusById from '../controllers/offers/status/single';
import ShowAllOfferStatusByOfferid from '../controllers/offers/status/showbyofferid';
import DeleteSingleOfferStatusById from '../controllers/offers/status/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all offer status
route.get(``, UserAuthMiddleware, ShowAllOfferStatus);
//Create a offer status
route.post(``, AdminAuthMiddleware, CreateOfferStatus);
//Show info about a specific offer status
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferStatusById);
//Show info about a views by offer id
route.get(`/offer/:offerid`, UserAuthMiddleware, ShowAllOfferStatusByOfferid);
//Update a particular offer status
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferStatus);
//Delete a particular offer status
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferStatusById);

export default route;