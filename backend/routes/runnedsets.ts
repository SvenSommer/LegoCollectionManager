import CreateRunnedSet from '../controllers/runnedsets/create';
import ShowAllRunnedSets from '../controllers/runnedsets/show';
import ShowAllRunnedSetsByCollectionId from '../controllers/runnedsets/showByCollectionId';
import ShowAllRunnedSetsByRunId from '../controllers/runnedsets/showByRunId';
import ShowAllRunnedSetsBySetno from '../controllers/runnedsets/showBySetno';
import ShowAllRunnedSetsByExpectedsetid from '../controllers/runnedsets/showByExpectedSetId';
import UpdateRunnedSetById from '../controllers/runnedsets/update';
import GetSingleRunnedSetById from '../controllers/runnedsets/single';
import DeleteSingleRunnedSetById from '../controllers/runnedsets/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all RunnedSets
route.get(``, UserAuthMiddleware, ShowAllRunnedSets);
//List all RunnedSets by Collectionid
route.get(`/collection/:collectionid`, UserAuthMiddleware, ShowAllRunnedSetsByCollectionId);
//List all RunnedSets by Runid
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllRunnedSetsByRunId);
//List all RunnedSets by setno
route.get(`/setno/:setno`, UserAuthMiddleware, ShowAllRunnedSetsBySetno);
//List all RunnedSets by expectedSetId
route.get(`/expectedsetid/:expectedsetid`, UserAuthMiddleware, ShowAllRunnedSetsByExpectedsetid);
//Create a new RunnedSet
route.post(``, AdminAuthMiddleware, CreateRunnedSet);
//Show info about a specific RunnedSet
route.get(`/:id`, UserAuthMiddleware, GetSingleRunnedSetById);
//Update a particular RunnedSet
route.put(`/:id`, AdminAuthMiddleware, UpdateRunnedSetById);
//Delete a particular RunnedSet
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRunnedSetById);
export default route;