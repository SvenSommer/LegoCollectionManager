import CreatePartnameFrequency from '../controllers/partdata/partnames_frequency/create';
import ShowAllPartData from '../controllers/partdata/show';
import ShowAllPartNameFrequency from '../controllers/partdata/partnames_frequency/show';
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
route.get(`/partnamefrequency`, UserAuthMiddleware, ShowAllPartNameFrequency);
//SaveData from Name analysis
route.post(`/partnamefrequency`, AdminAuthMiddleware, CreatePartnameFrequency);
//Show info about a setDetail
route.get(`/:id`, UserAuthMiddleware, GetSinglePartDataById);
//Delete a particular setDetail
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePartDataById);

export default route;