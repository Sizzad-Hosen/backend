import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js"
import ProductModel from "../models/product.model.js"

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

  
    if (!name || !image) {
      return res.status(400).json({
        message: "Please provide both category name and image URL",
        error: true,
        success: false,
      });
    }

    const addCategory = new CategoryModel({
      name,
      image,
    });
    const savedCategory = await addCategory.save();

    if (!savedCategory) {
      return res.status(500).json({
        message: "Category creation failed",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Category added successfully",
      error: false,
      success: true,
      data: savedCategory, // Optionally return the saved category data
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({
      message: "An error occurred while adding the category",
      error: true,
      success: false,
    });
  }
};

export const getCategoryController = async (req, res) => {
    try {
      const data = await CategoryModel.find();
  
      return res.status(200).json({
        message: "Data retrieved successfully",
        data: data,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while getting the category",
        error: true,
        success: false,
      });
    }
  };



 export const updateCategoryController = async (req, res) => {
    try {
        const { _id, image, name } = req.body;

        // Check if _id is provided
        if (!_id) {
            return res.status(400).json({
                message: "Category ID is required",
                error: true,
                success: false,
            });
        }

        // Find category by ID and update it
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            _id,
            { name, image },
            { new: true } // Returns the updated document
        );

        // If category not found
        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
                success: false,
            });
        }

        return res.status(200).json({
            message: "Updated successfully",
            data: updatedCategory,
            error: false,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the category",
            error: true,
            success: false,
        });
    }
};



export const deleteCategoryController = async(request,response)=>{
  try {
      const { _id } = request.body 

      const checkSubCategory = await SubCategoryModel.find({
          category : {
              "$in" : [ _id ]
          }
      }).countDocuments()

      const checkProduct = await ProductModel.find({
          category : {
              "$in" : [ _id ]
          }
      }).countDocuments()

      if(checkSubCategory >  0 || checkProduct > 0 ){
          return response.status(400).json({
              message : "Category is already use can't delete",
              error : true,
              success : false
          })
      }

      const deleteCategory = await CategoryModel.deleteOne({ _id : _id})

      return response.json({
          message : "Delete category successfully",
          data : deleteCategory,
          error : false,
          success : true
      })

  } catch (error) {
     return response.status(500).json({
          message : error.message || error,
          success : false,
          error : true
     }) 
  }
}