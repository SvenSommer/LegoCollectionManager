import CreateSortedSet from '../controllers/sortedsets/create';
import ShowAllSortedSets from '../controllers/sortedsets/show';
import ShowAllSortedSetsByCollectionId from '../controllers/sortedsets/showByCollectionId';
import ShowAllSortedSetsByRunId from '../controllers/sortedsets/showByRunId';
import UpdateSortedSetById from '../controllers/sortedsets/update';
import GetSingleSortedSetById from '../controllers/sortedsets/single';
import DeleteSingleSortedSetById from '../controllers/sortedsets/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all SortedSets
route.get(``, UserAuthMiddleware, ShowAllSortedSets);
//List all SortedSets by Collectionid
route.get(`/collection/:collectionid`, UserAuthMiddleware, ShowAllSortedSetsByCollectionId);
//List all SortedSets by Runid
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllSortedSetsByRunId);
//Create a new SortedSet
route.post(``, AdminAuthMiddleware, CreateSortedSet);
//Show info about a specific SortedSet
route.get(`/:id`, UserAuthMiddleware, GetSingleSortedSetById);
//Update a particular SortedSet
route.put(`/:id`, AdminAuthMiddleware, UpdateSortedSetById);
//Delete a particular SortedSet
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSortedSetById);
export default route;