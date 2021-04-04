import CreateIdentifiedPart from '../controllers/identifiedparts/create';
import ShowAllIdentifiedParts from '../controllers/identifiedparts/show';
import ShowAllIdentifiedPartsByRunId from '../controllers/identifiedparts/showByRunId';
import ShowAllUnsettedIdentifiedPartsByCollectionId from '../controllers/identifiedparts/showUnsettedByCollectionId';

import UpdateIdentifiedPartById from '../controllers/identifiedparts/update';
import GetSingleIdentifiedPartById from '../controllers/identifiedparts/single';
import DeleteSingleIdentifiedPartById from '../controllers/identifiedparts/delete';
import MarkAsDeletedIdentifiedPartById from '../controllers/identifiedparts/markasdeleted';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all RecognisedParts
route.get(``, UserAuthMiddleware, ShowAllIdentifiedParts);
//List all RecognisedParts by RunId
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllIdentifiedPartsByRunId);
//Show unsetted RecognisedParts od collectionid
route.get(`/collection/:collectionid/unsetted`, UserAuthMiddleware, ShowAllUnsettedIdentifiedPartsByCollectionId);
//Create a new RecognisedPart
route.post(``, AdminAuthMiddleware, CreateIdentifiedPart);
//Show info about a RecognisedPart
route.get(`/:id`, UserAuthMiddleware, GetSingleIdentifiedPartById);
//Update a particular RecognisedPart
route.put(`/:id`, AdminAuthMiddleware, UpdateIdentifiedPartById);
//Delete a particular RecognisedPart
//route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleRecognisedPartById);
//Mark RecognisedPart as deleted
route.patch(`/:id`, AdminAuthMiddleware, MarkAsDeletedIdentifiedPartById);
route.delete(`/:id`, AdminAuthMiddleware, MarkAsDeletedIdentifiedPartById);
export default route;