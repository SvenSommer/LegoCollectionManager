
import ShowAllSetData from '../controllers/setdata/show';
import GetSingleSetDataById from '../controllers/setdata/single';
import DeleteSingleSetDataById from '../controllers/setdata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all setDetails
route.get(``, UserAuthMiddleware, ShowAllSetData);
//Show info about a setDetail
route.get(`/:id`, UserAuthMiddleware, GetSingleSetDataById);
//Delete a particular setDetail
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSetDataById);

export default route;