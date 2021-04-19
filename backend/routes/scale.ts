import CreateScale from '../controllers/scales/create';
import ShowAllScales from '../controllers/scales/show';
import ShowAllScalesBySorterid from '../controllers/scales/showBySorter';
import ShowScaleInfoBySorteridAndScaleNo from '../controllers/scales/showBySorterAndScaleNo';
import UpdateScalesById from '../controllers/scales/update';
import GetSingleScaleById from '../controllers/scales/single';
import DeleteSingleScaleById from '../controllers/scales/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Scales
route.get(``, UserAuthMiddleware, ShowAllScales);
//List all Scale by Sorterid
route.get(`/sorter/:sorterid`, UserAuthMiddleware, ShowAllScalesBySorterid);
//Show SetInfo for Sorterid and ScaleNo
route.get(`/sorter/:sorterid/scaleno/1`, UserAuthMiddleware, ShowScaleInfoBySorteridAndScaleNo);
//Create a new Scale
route.post(``, AdminAuthMiddleware, CreateScale);
//Show info about a specific Scale
route.get(`/:id`, UserAuthMiddleware, GetSingleScaleById);
//Update a particular Scale
route.put(`/:id`, AdminAuthMiddleware, UpdateScalesById);
//Delete a particular Scale
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleScaleById);
export default route;