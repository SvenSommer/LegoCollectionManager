import CreateExpectedPartsOfSet from '../controllers/expectedparts/createPartsOfSortedSet';
import ShowAllExpectedParts from '../controllers/expectedparts/show';
import ShowAllExpectedPartDataBySetid from '../controllers/expectedparts/showPartsByExpectedSetid';
import ShowAllExpectedMinifigDataBySetid from '../controllers/expectedparts/showMinifigsBySetid';
import DeleteSingleExpectedPartById from '../controllers/expectedparts/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all ExpectedParts
route.get(``, UserAuthMiddleware, ShowAllExpectedParts);
//Create a new ExpectedParts of Setno
route.post(`/createpartsofsetno`, AdminAuthMiddleware, CreateExpectedPartsOfSet);
//List expected Parts by setno
route.get(`/expectedsetid/:expectedsetid/parts`, UserAuthMiddleware, ShowAllExpectedPartDataBySetid);
//List expected Minifigs by setno
route.get(`/expectedsetid/:expectedsetid/minifigs`, UserAuthMiddleware, ShowAllExpectedMinifigDataBySetid);
//Delete a particular ExpectedParts
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleExpectedPartById);
export default route;