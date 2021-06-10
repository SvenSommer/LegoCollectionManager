import CreateSortedPart from '../controllers/sortedparts/create';
import CreatePartsOfSet from '../controllers/expectedparts/createPartsOfSortedSet';
import ShowAllSortedParts from '../controllers/sortedparts/show';
import ShowAllSortedPartsByCollectionId from '../controllers/sortedparts/showByCollectionId';
import ShowAllSortedPartsByExpectedSetId from '../controllers/sortedparts/showByExpectedSetId';
import ShowAllSortedPartsByRunId from '../controllers/sortedparts/showByRunId';
import UpdateSortedPartById from '../controllers/sortedparts/update';
import GetSingleSortedPartById from '../controllers/sortedparts/single';
import DeleteSingleSortedPartAsDeletedById from '../controllers/sortedparts/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all SortedParts
route.get(``, UserAuthMiddleware, ShowAllSortedParts);
//List all SortedParts by Collectionid
route.get(`/collection/:collectionid`, UserAuthMiddleware, ShowAllSortedPartsByCollectionId);
//List all SortedParts by sortedSetid
route.get(`/expectedsetid/:expectedsetid`, UserAuthMiddleware, ShowAllSortedPartsByExpectedSetId);
//List all SortedParts by sortedRunid
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllSortedPartsByRunId);

route.post(`/createpartofset`, AdminAuthMiddleware, CreatePartsOfSet);
//Create a new SortedPart
route.post(``, AdminAuthMiddleware, CreateSortedPart);

//Show info about a specific SortedPart
route.get(`/:id`, UserAuthMiddleware, GetSingleSortedPartById);
//Update a particular SortedPart
route.put(`/:id`, AdminAuthMiddleware, UpdateSortedPartById);
//Delete a particular SortedPart
route.delete(`/expectedpartid/:expectedpartid`, AdminAuthMiddleware, DeleteSingleSortedPartAsDeletedById);
export default route;