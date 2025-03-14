
import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController } from '../controllers/product.controller.js'



const productRouter = Router()

productRouter.post("/create",auth,createProductController)

// productRouter.post('/get',getProductController)
// productRouter.post("/get-product-by-category",getProductByCategory)
// productRouter.post('/get-pruduct-by-category-and-subcategory',getProductByCategoryAndSubCategory)
// productRouter.post('/get-product-details',getProductDetails)


export default productRouter;
