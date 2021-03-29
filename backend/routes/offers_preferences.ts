import CreateOfferPreference from '../controllers/offers/preferences/create';
import ShowAllOfferPreferences from '../controllers/offers/preferences/show';
import UpdateOfferPreferenceById from '../controllers/offers/preferences/update';
import GetSingleOfferPreferenceById from '../controllers/offers/preferences/single';
import DeleteSingleOfferPreferenceById from '../controllers/offers/preferences/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all offer preferences
route.get(``, UserAuthMiddleware, ShowAllOfferPreferences);
//Create a new offer preference
route.post(``, AdminAuthMiddleware, CreateOfferPreference);
//Show info about a offer preference
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferPreferenceById);
//Update a particular offer preference
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferPreferenceById);
//Delete a particular offer preference
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferPreferenceById);

export default route;