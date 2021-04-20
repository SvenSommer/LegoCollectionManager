import CreateMessage from '../controllers/offers/messages/create';
import ShowAllMessages from '../controllers/offers/messages/show';
import ShowAllMessagesById from '../controllers/offers/messages/showbyOfferId';
import GetSingleMessage from '../controllers/offers/messages/single';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all Messages
route.get(``, UserAuthMiddleware, ShowAllMessages);
//List all Messages By offer id
route.get(`/offer/:offerid`, UserAuthMiddleware, ShowAllMessagesById);
//Create a Message
route.post(``, AdminAuthMiddleware, CreateMessage);
//Show info about a Message
route.get(`/:id`, UserAuthMiddleware, GetSingleMessage);


export default route;