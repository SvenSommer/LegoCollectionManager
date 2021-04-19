//import CreateOfferAccount from '../controllers/offers/accounts/create';
import ShowAllOfferAccounts from '../controllers/offers/accounts/show';
//import UpdateOfferAccountById from '../controllers/offers/accounts/update';
import GetSingleOfferAccountById from '../controllers/offers/accounts/single';
//import DeleteSingleOfferAccountById from '../controllers/offers/accounts/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Accounts
route.get(``, UserAuthMiddleware, ShowAllOfferAccounts);
//Create a Account
//route.post(``, AdminAuthMiddleware, CreateOfferAccount);
//Show info about a specific Account
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferAccountById);
//Update a particular Account
//route.put(`/:id`, AdminAuthMiddleware, UpdateOfferAccountById);
//Delete a particular account
//route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferAccountById);

export default route;