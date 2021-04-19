import CreatePossibleSet from '../controllers/offers/possiblesets/create';
import ShowAllPossibleSets from '../controllers/offers/possiblesets/show';
import ShowAllPossibleSetsByOfferid from '../controllers/offers/possiblesets/showbyofferid';
import UpdatePossibleSet from '../controllers/offers/possiblesets/update';
import GetSinglePossibleSetById from '../controllers/offers/possiblesets/single';
import DeleteSinglePossibleSetById from '../controllers/offers/possiblesets/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all offer possible Sets
route.get(``, UserAuthMiddleware, ShowAllPossibleSets);
//Create a offer  possible Sets
route.post(``, AdminAuthMiddleware, CreatePossibleSet);
//Show info about a poosibelsets by offer id
route.get(`/offer/:offerid`, UserAuthMiddleware, ShowAllPossibleSetsByOfferid);
//Show info about a specific possible set
route.get(`/:id`, UserAuthMiddleware, GetSinglePossibleSetById);
//Update a particular possible set
route.put(`/:id`, AdminAuthMiddleware, UpdatePossibleSet);
//Delete a particular possible set
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePossibleSetById);

export default route;