import CreatePartnameFrequencyCache from '../controllers/partdata/partnamefrequencycache/create';
import ShowAllPartData from '../controllers/partdata/show';
import ShowAllPartNameFrequencyCache from '../controllers/partdata/partnamefrequencycache/show';
import ShowAllPartDataAggregatedbypartno from '../controllers/partdata/showAggregatedByNo';
import GetSinglePartDataById from '../controllers/partdata/single';
import DeleteSinglePartDataById from '../controllers/partdata/delete';
import AdminAuthMiddleware from "../controllers/middleware/AdminAuth.middleware";
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();

//List all setDetails
route.get(``, UserAuthMiddleware, ShowAllPartData);
route.get(`/aggregatedbypartno/:searchwords`, UserAuthMiddleware, ShowAllPartDataAggregatedbypartno);
//Get all cached entries for searchwords
route.get(`/partnamefrequencycache/:searchwords`, UserAuthMiddleware, ShowAllPartNameFrequencyCache);
//SaveData from Name analysis
route.post(`/partnamefrequencycache`, AdminAuthMiddleware, CreatePartnameFrequencyCache);
//Show info about a setDetail
route.get(`/:id`, UserAuthMiddleware, GetSinglePartDataById);
//Delete a particular setDetail
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePartDataById);

export default route;