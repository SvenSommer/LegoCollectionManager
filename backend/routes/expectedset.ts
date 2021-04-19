import CreateSet from '../controllers/expectedsets/create';
import ShowAllSets from '../controllers/expectedsets/show';
import ShowAllSetsByCollectionId from '../controllers/expectedsets/showByCollectionId';
import UpdateSetById from '../controllers/expectedsets/update';
import GetSingleSetById from '../controllers/expectedsets/single';
import DeleteSingleSetById from '../controllers/expectedsets/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all sets
route.get(``, UserAuthMiddleware, ShowAllSets);
//List all sets by CollectionId
route.get(`/collection/:collectionid`, UserAuthMiddleware, ShowAllSetsByCollectionId);
//Create a new set
route.post(``, AdminAuthMiddleware, CreateSet);
//Show info about a set
route.get(`/:id`, UserAuthMiddleware, GetSingleSetById);
//Update a particular set
route.put(`/:id`, AdminAuthMiddleware, UpdateSetById);
//Delete a particular set
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSetById);

export default route;