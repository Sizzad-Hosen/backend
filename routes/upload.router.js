import uploadImageController  from "../controllers/uploadImage.controller.js"; 
import auth from "../middleware/auth.js";
import { Router } from "express";
import upload from "../middleware/multer.js";
import { updateCategoryController } from "../controllers/category.controller.js";

const uploadRouter = Router();

uploadRouter.post("/upload", auth, upload.single("image"), uploadImageController);

export default uploadRouter;
