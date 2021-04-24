import DownloadPartData from '../controllers/partdata/download';
import CreatePartnameFrequency from '../controllers/partdata/partnames_frequency/create';
import ShowAllPartData from '../controllers/partdata/show';
import ShowAllPartNameFrequency from '../controllers/partdata/partnames_frequency/show';
import ShowAllPartDataAggregatedbypartno from '../controllers/partdata/showAggregatedByNo';
import RefreshPartDataById from '../controllers/partdata/refresh';
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
//Download a new setDetail
route.post(``, AdminAuthMiddleware, DownloadPartData);
//SaveData from Name analysis
route.post(`/partnamefrequency`, AdminAuthMiddleware, CreatePartnameFrequency);
//Show info about a setDetail
route.get(`/:id`, UserAuthMiddleware, GetSinglePartDataById);
//Refresh info of a particular setDetail
route.put(`/:id`, AdminAuthMiddleware, RefreshPartDataById);
//Delete a particular setDetail
route.delete(`/:id`, AdminAuthMiddleware, DeleteSinglePartDataById);

export default route;