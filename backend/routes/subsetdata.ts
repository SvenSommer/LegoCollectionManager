import DownloadSubsetData from '../controllers/subsetdata/download';
import ShowAllSubsetData from '../controllers/subsetdata/show';
import ShowAllPartsByCollectionId from '../controllers/subsetdata/showPartsByCollectionId';
import ShowAllMinifigsByCollectionId from '../controllers/subsetdata/showMinifigsByCollectionId';
import ShowAllSubsetDataBySetno from '../controllers/subsetdata/showPartsBySetno';
import GetSingleSubsetDataById from '../controllers/subsetdata/single';
import DeleteSingleSubsetDataById from '../controllers/subsetdata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all SubsetData
route.get(``, UserAuthMiddleware, ShowAllSubsetData);
//List expected Parts by CollectionId
route.get(`/collection/:collectionid/parts`, UserAuthMiddleware, ShowAllPartsByCollectionId);
//List expected Parts by CollectionId
route.get(`/collection/:collectionid/minifigs`, UserAuthMiddleware, ShowAllMinifigsByCollectionId);
//List expected Parts by setno
route.get(`/setno/:setnumber`, UserAuthMiddleware, ShowAllSubsetDataBySetno);
//Download a new SubsetData
route.post(``, AdminAuthMiddleware, DownloadSubsetData);
//Show info about a SubsetData
route.get(`/:id`, UserAuthMiddleware, GetSingleSubsetDataById);
//Delete a particular SubsetData
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleSubsetDataById);

export default route;