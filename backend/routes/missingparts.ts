import ShowAllMissingParts from '../controllers/missingparts/show';
import ShowMissingPartsByExpectedSetid from '../controllers/missingparts/showByExpectedSetId';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Missing Parts
route.get(``, AdminAuthMiddleware, ShowAllMissingParts);
//Show info about a specific Sorter
route.get(`/expectedsetid/:expectedsetid`, AdminAuthMiddleware, ShowMissingPartsByExpectedSetid);
export default route;