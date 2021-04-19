import CreateOfferProperty from '../controllers/offers/properties/create';
import ShowAllOfferProperties from '../controllers/offers/properties/show';
import ShowAllOfferPropertiesByOfferid from '../controllers/offers/properties/showbyofferid';
import UpdateOfferPropertyById from '../controllers/offers/properties/update';
import GetSingleOfferPropertyById from '../controllers/offers/properties/single';
import DeleteSingleOfferPropertyById from '../controllers/offers/properties/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Properties
route.get(``, UserAuthMiddleware, ShowAllOfferProperties);
//Create a Property 
route.post(``, AdminAuthMiddleware, CreateOfferProperty);
//Show info about a Properties by offer id
route.get(`/offer/:offerid`, UserAuthMiddleware, ShowAllOfferPropertiesByOfferid);
//Show info about a specific Property of offer
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferPropertyById);
//Update a particular Property of offer
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferPropertyById);
//Delete a particular Property of offer
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferPropertyById);

export default route;