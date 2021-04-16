import CreateMessageText from '../controllers/offers/messagetexts/create';
import ShowAllMessageTexts from '../controllers/offers/messagetexts/show';
import UpdateMessageText from '../controllers/offers/messagetexts/update';
import GetSingleMessageText from '../controllers/offers/messagetexts/single';
import DeleteSingleMessageText from '../controllers/offers/messagetexts/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all MessageTexts
route.get(``, UserAuthMiddleware, ShowAllMessageTexts);
//Create a MessageText
route.post(``, AdminAuthMiddleware, CreateMessageText);
//Show info about a Message Text
route.get(`/:id`, UserAuthMiddleware, GetSingleMessageText);
//Update a particular MessageText
route.put(`/:id`, AdminAuthMiddleware, UpdateMessageText);
//Delete a particular MessageText
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleMessageText);

export default route;