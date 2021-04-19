import CreateOfferView from '../controllers/offers/views/create';
import ShowAllOfferViews from '../controllers/offers/views/show';
import ShowAllOfferViewsByOfferid from '../controllers/offers/views/showbyofferid';
import UpdateOfferViewById from '../controllers/offers/views/update';
import GetSingleOfferViewById from '../controllers/offers/views/single';
import DeleteSingleOfferViewById from '../controllers/offers/views/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all views of offers
route.get(``, UserAuthMiddleware, ShowAllOfferViews);
//Create a offerView 
route.post(``, AdminAuthMiddleware, CreateOfferView);
//Show info about a views by offer id
route.get(`/offer/:offerid`, UserAuthMiddleware, ShowAllOfferViewsByOfferid);
//Show info about a specific View of offer
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferViewById);
//Update a particular View of offer
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferViewById);
//Delete a particular View of offer
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferViewById);

export default route;