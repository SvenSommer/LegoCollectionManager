import CreateTask from '../controllers/tasks/create';
import ShowAllTasks from '../controllers/tasks/show';
import ShowAllOpenTasksByTypeid from '../controllers/tasks/showOpenByTypeId';
import ShowAllTasksByStatusid from '../controllers/tasks/showBystatusId';
import UpdateTaskById from '../controllers/tasks/update';
import UpdateStatuskByTaskId from '../controllers/tasks/updateStatus';
import GetSingleTaskById from '../controllers/tasks/single';
import DeleteSingleTaskById from '../controllers/tasks/delete';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import {Router} from "express";
const route = Router();

//List all Tasks
route.get(``, UserAuthMiddleware, ShowAllTasks);
//List all open Tasks by typeid
route.get(`/type/:typeid/open`, UserAuthMiddleware, ShowAllOpenTasksByTypeid);
//Show SetInfo for Sorterid and ScaleNo
route.get(`/status/:statusid`, UserAuthMiddleware, ShowAllTasksByStatusid);
//Create a new Task
route.post(``, AdminAuthMiddleware, CreateTask);
//Show info about a specific Task
route.get(`/:id`, UserAuthMiddleware, GetSingleTaskById);
//Update a particular Task
route.put(`/:id`, AdminAuthMiddleware, UpdateTaskById);
//Update Status of particular Task
route.put(`/:id/status`, AdminAuthMiddleware, UpdateStatuskByTaskId);
//Delete a particular Task
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleTaskById);
export default route;