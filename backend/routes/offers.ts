import CreateOffer from '../controllers/offers/create';
import ShowAllOffers from '../controllers/offers/show';
import ShowAllOffersFromInterest from '../controllers/offers/showFromInterest';
import UpdateOfferById from '../controllers/offers/update';
import GetSingleOfferById from '../controllers/offers/single';
import GetSingleOfferByExternalid from '../controllers/offers/singleByExternalid';
import ShowOffersByUserid from '../controllers/offers/showByUserid';
import DeleteSingleOfferById from '../controllers/offers/delete';
import MarkDeletedOfferById from '../controllers/offers/markDeletedByUser';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all offers
route.get(``, UserAuthMiddleware, ShowAllOffers);
route.get(`/frominterest`, UserAuthMiddleware, ShowAllOffersFromInterest);
//Create a new offer
route.post(``, AdminAuthMiddleware, CreateOffer);
//Show info about a specific offer
route.get(`/:id`, UserAuthMiddleware, GetSingleOfferById);
//Show Info about a specific offer by external id
route.get(`/externalid/:id`, UserAuthMiddleware, GetSingleOfferByExternalid);
//Show Info about a specific offer by user id
route.get(`/userid/:userid`, UserAuthMiddleware, ShowOffersByUserid);
//Update a particular offer
route.put(`/:id`, AdminAuthMiddleware, UpdateOfferById);
//Delete a particular offer
route.delete(`/:id`, AdminAuthMiddleware, DeleteSingleOfferById);
//Mark offer deleted by ext user
route.delete(`/byextuser/:id`, AdminAuthMiddleware, MarkDeletedOfferById);

export default route;