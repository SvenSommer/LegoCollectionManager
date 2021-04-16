
import UpdateSUserCategoryById from '../controllers/offers/users/categories/updatebyid'
import ShowAllUserCategories from '../controllers/offers/users/categories/show'

import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();


//List all User Categories
route.get(``, UserAuthMiddleware, ShowAllUserCategories);
//Update a particular SortedPart
route.put(`/userid/:id`, UserAuthMiddleware, UpdateSUserCategoryById);

export default route;