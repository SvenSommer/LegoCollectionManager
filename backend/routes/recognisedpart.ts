import CreateRecognisedPart from '../controllers/identifiedparts/create';
import ShowAllRecognisedParts from '../controllers/identifiedparts/show';
import ShowAllRecognisedPartsByRunId from '../controllers/identifiedparts/showByRunId';
import ShowAllUnsettedRecognisedPartsByCollectionId from '../controllers/identifiedparts/showUnsettedByCollectionId';

import UpdateRecognisedPartById from '../controllers/identifiedparts/update';
import GetSingleRecognisedPartById from '../controllers/identifiedparts/single';
import DeleteSingleRecognisedPartById from '../controllers/identifiedparts/delete';
import MarkAsDeletedRecognisedPartById from '../controllers/identifiedparts/markasdeleted';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all RecognisedParts
route.get(``, UserAuthMiddleware, ShowAllRecognisedParts);
//List all RecognisedParts by RunId
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllRecognisedPartsByRunId);
//Show unsetted RecognisedParts od collectionid
route.get(`/collection/:collectionid/unsetted`, UserAuthMiddleware, ShowAllUnsettedRecognisedPartsByCollectionId);
//Create a new RecognisedPart
route.post(``, AdminAuthMiddleware, CreateRecognisedPart);
//Show info about a RecognisedPart
route.get(`/:id`, UserAuthMiddleware, GetSingleRecognisedPartById);
//Update a particular RecognisedPart
route.put(`/:id`, AdminAuthMiddleware, UpdateRecognisedPartById);
//Delete a particular RecognisedPart
//route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRecognisedPartById);
//Mark RecognisedPart as deleted
route.patch(`/:id`, AdminAuthMiddleware, MarkAsDeletedRecognisedPartById);
route.delete(`/:id`, AdminAuthMiddleware, MarkAsDeletedRecognisedPartById);
export default route;