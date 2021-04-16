import CreateSortedPart from '../controllers/sortedparts/create';
import ShowAllSortedParts from '../controllers/sortedparts/show';
import ShowAllSortedPartsByCollectionId from '../controllers/sortedparts/showByCollectionId';
import ShowAllSortedPartsBySetId from '../controllers/sortedparts/showBySetId';
import ShowAllSortedPartsByRunId from '../controllers/sortedparts/showByRunId';
import UpdateSortedPartById from '../controllers/sortedparts/update';
import GetSingleSortedPartById from '../controllers/sortedparts/single';
import DeleteSingleSortedPartById from '../controllers/sortedparts/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all SortedParts
route.get(``, UserAuthMiddleware, ShowAllSortedParts);
//List all SortedParts by Collectionid
route.get(`/collection/:collectionid`, UserAuthMiddleware, ShowAllSortedPartsByCollectionId);
//List all SortedParts by sortedSetid
route.get(`/sortedset/:setid`, UserAuthMiddleware, ShowAllSortedPartsBySetId);
//List all SortedParts by sortedRunid
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllSortedPartsByRunId);
//Create a new SortedPart
route.post(``, AdminAuthMiddleware, CreateSortedPart);
//Show info about a specific SortedPart
route.get(`/:id`, UserAuthMiddleware, GetSingleSortedPartById);
//Update a particular SortedPart
route.put(`/:id`, AdminAuthMiddleware, UpdateSortedPartById);
//Delete a particular SortedPart
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSortedPartById);
export default route;