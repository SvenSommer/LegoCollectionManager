import CreateIdentifiedPart from '../controllers/identifiedparts/create';
import ShowAllIdentifiedParts from '../controllers/identifiedparts/show';
import ShowAllIdentifiedPartsByRunId from '../controllers/identifiedparts/showByRunId';
import ShowAllScreenedPartsByRunId from '../controllers/identifiedparts/showScreenedByRunId';
import ShowAllUnsettedIdentifiedPartsByCollectionId from '../controllers/identifiedparts/showUnsettedByCollectionId';

import UpdateIdentifiedPartById from '../controllers/identifiedparts/update';
import GetSingleIdentifiedPartById from '../controllers/identifiedparts/single';
import DeleteSingleIdentifiedPartById from '../controllers/identifiedparts/delete';
import MarkAsDeletedIdentifiedPartById from '../controllers/identifiedparts/markasdeleted';
import UnlabelPartById from '../controllers/identifiedparts/unlabel';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all IdentifiedParts
route.get(``, UserAuthMiddleware, ShowAllIdentifiedParts);
//List all IdentifiedParts by RunId
route.get(`/run/:runid`, UserAuthMiddleware, ShowAllIdentifiedPartsByRunId);
route.get(`/run/:runid/screened`, UserAuthMiddleware, ShowAllScreenedPartsByRunId);
//Show unsetted IdentifiedParts od collectionid
route.get(`/collection/:collectionid/unsetted`, UserAuthMiddleware, ShowAllUnsettedIdentifiedPartsByCollectionId);
//Create a new IdentifiedPart
route.post(``, AdminAuthMiddleware, CreateIdentifiedPart);
//Show info about a IdentifiedPart
route.get(`/:id`, UserAuthMiddleware, GetSingleIdentifiedPartById);
//Update a particular IdentifiedPart
route.put(`/:id`, AdminAuthMiddleware, UpdateIdentifiedPartById);
//Delete a particular IdentifiedPart
//route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleIdentifiedPartById);
//Mark IdentifiedPart as deleted
route.patch(`/:id`, AdminAuthMiddleware, MarkAsDeletedIdentifiedPartById);
route.delete(`/:id`, AdminAuthMiddleware, MarkAsDeletedIdentifiedPartById);
route.delete(`/:id/unlabel`, AdminAuthMiddleware, UnlabelPartById);
export default route;