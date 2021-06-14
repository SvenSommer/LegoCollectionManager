import ShowAllMissingParts from '../controllers/missingparts/show';
import ShowMissingPartsByExpectedSetid from '../controllers/missingparts/showByExpectedSetId';
import ShowMissingPartsByPartnoAndColorid from '../controllers/missingparts/showByPartnoAndColorid';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Missing Parts
route.get(``, AdminAuthMiddleware, ShowAllMissingParts);
//Show info about a specific Sorter
route.get(`/expectedsetid/:expectedsetid`, AdminAuthMiddleware, ShowMissingPartsByExpectedSetid);
//Show info about a specific Sorter
route.get(`/partno/:partno/colorid/:colorid`, AdminAuthMiddleware, ShowMissingPartsByPartnoAndColorid);
export default route;