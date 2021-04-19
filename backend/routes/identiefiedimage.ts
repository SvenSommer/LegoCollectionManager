import CreateIdentiefiedImage from '../controllers/identifiedimages/create';
import ShowAllIdentifiedImages from '../controllers/identifiedimages/show';
import ShowAllIdentifiedImagesByRunId from '../controllers/identifiedimages/showByRunId';
import ShowAllIdentifiedImagesByPartId from '../controllers/identifiedimages/showByPartId';
import UpdateIDentifedImageById from '../controllers/identifiedimages/update';
import GetSingleIdentifiedImageById from '../controllers/identifiedimages/single';
import DeleteSingleIdentifiedImageById from '../controllers/identifiedimages/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all IdentifiedImages
route.get(``, UserAuthMiddleware, ShowAllIdentifiedImages);
//List all IdentifiedImages by RunId
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllIdentifiedImagesByRunId);
//List all IdentifiedImages by PartId
route.get(`/part/:partid`, UserAuthMiddleware, ShowAllIdentifiedImagesByPartId);
//Create a new IdentiefiedImage
route.post(``, AdminAuthMiddleware, CreateIdentiefiedImage);
//Show info about a IdentiefiedImage
route.get(`/:id`, UserAuthMiddleware, GetSingleIdentifiedImageById);
//Update a particular IdentiefiedImage
route.put(`/:id`, AdminAuthMiddleware, UpdateIDentifedImageById);
//Delete a particular IdentiefiedImage
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleIdentifiedImageById);

export default route;