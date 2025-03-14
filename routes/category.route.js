import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";
import {Router } from "express"


const categoryRoute = Router();

categoryRoute.post("/add-category",auth,AddCategoryController)

categoryRoute.get("/get",auth,getCategoryController)
categoryRoute.put("/update",auth,updateCategoryController)
categoryRoute.delete("/delete",auth,deleteCategoryController)
export default categoryRoute;
