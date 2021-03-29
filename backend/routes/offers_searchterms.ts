import CreateOfferPreference from '../controllers/offers/searchterms/create';
import ShowAllOfferSearchterms from '../controllers/offers/searchterms/show';
import UpdateOfferSearchtermById from '../controllers/offers/searchterms/update';
import GetSingleOfferSearchtermById from '../controllers/offers/searchterms/single';
import DeleteSingleOfferSearchtermById from '../controllers/offers/searchterms/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all offer searchterms
route.get(``, UserAuthMiddleware, ShowAllOfferSearchterms);
//Create a new offer searchterm
route.post(``, AdminAuthMiddleware, CreateOfferPreference);
//Show info about a offer searchterm
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferSearchtermById);
//Update a particular offer searchterm
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferSearchtermById);
//Delete a particular offer searchterm
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferSearchtermById);

export default route;