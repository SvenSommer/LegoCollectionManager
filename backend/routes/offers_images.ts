import CreateImageOffer from '../controllers/offers/images/create';
import ShowAllImageOffer from '../controllers/offers/images/show';
import GetSingleImageOfferById from '../controllers/offers/images/single';
import DeleteSingleImageOfferById from '../controllers/offers/images/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all images of offers
route.get(``, UserAuthMiddleware, ShowAllImageOffer);
//Create a image of offer
route.post(``, AdminAuthMiddleware, CreateImageOffer);
//Show info about a specific image of offer
route.get(`/:id`, UserAuthMiddleware, GetSingleImageOfferById);
//Delete a particular image of offer
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleImageOfferById);

export default route;

