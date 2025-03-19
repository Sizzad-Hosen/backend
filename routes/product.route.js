
import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController, deleteProductDetails, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, searchProduct, updateProductDetails } from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'


const productRouter = Router()

productRouter.post("/create",auth,admin,createProductController)

productRouter.get('/get',getProductController)

 productRouter.post("/get-product-by-category",getProductByCategory)
 productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryAndSubCategory)
 productRouter.post('/get-product-details',getProductDetails)
 productRouter.put("/updateProduct",auth,admin,updateProductDetails)
 productRouter.delete("/delete",auth,admin,deleteProductDetails)
 productRouter.post("/search-product", searchProduct);


export default productRouter;
