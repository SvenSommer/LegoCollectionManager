import CreateOfferUser from '../controllers/offers/users/create';
import ShowAllOfferUser from '../controllers/offers/users/show';
import UpdateOfferUserById from '../controllers/offers/users/update';
import GetSingleOfferUserById from '../controllers/offers/users/single';
import DeleteSingleOfferUserById from '../controllers/offers/users/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all users of offers
route.get(``, UserAuthMiddleware, ShowAllOfferUser);
//Create a user of offer
route.post(``, AdminAuthMiddleware, CreateOfferUser);
//Show info about a specific users of offer
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferUserById);
//Update a particular users of offer
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferUserById);
//Delete a particular users of offer
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferUserById);

export default route;