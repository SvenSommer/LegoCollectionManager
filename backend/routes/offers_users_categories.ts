
import ShowAllUserCategories from '../controllers/offers/users/categories/show'
'../controllers/users/categories/show';
import UserAuthMiddleware from '../controllers/middleware/UserAuth.middleware';
import {Router} from "express";
const route = Router();


//List all User Categories
route.get(``, UserAuthMiddleware, ShowAllUserCategories);


export default route;