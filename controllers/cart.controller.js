import CartProduct from '../models/cartProduct.model.js';

import UserModel from '../models/user.model.js';

export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        if (!productId) {
            return response.status(400).json({
                message: "Provide productId",
                error: true,
                success: false
            });
        }

        // Check if item already exists in the cart
        const checkItemCart = await CartProduct.findOne({ userId, productId });

        if (checkItemCart) {
            return response.status(400).json({
                message: "Item already in cart",
                error: true,
                success: false
            });
        }

        // Add new item to cart
        const cartItem = new CartProductModel({ quantity: 1, userId, productId });
        const savedCartItem = await cartItem.save();

        // Update user shopping cart
        await UserModel.findByIdAndUpdate(userId, {
            $addToSet: { shopping_cart: productId } // Ensures unique entries
        });

        return response.status(201).json({
            data: savedCartItem,
            message: "Item added successfully",
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Add to Cart Error:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

export const getCartItemController = async(request,response)=>{
    try {
        const userId = request.userId

        const cartItem =  await CartProductModel.find({
            userId : userId
        }).populate('productId')

        return response.json({
            data : cartItem,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateCartItemQtyController = async (request, response) => {
    try {
      const userId = request.userId; // Get userId from request
      const { cartItemId, quantity } = request.body; // Fix variable names
  
   
  
      if (!cartItemId || !quantity) {
        return response.status(400).json({
          message: "Provide cartItemId and quantity",
          success: false,
          error: true,
        });
      }
  
      // Check if the cart item exists before updating
      const existingCartItem = await CartProductModel.findOne({
        _id: cartItemId,
        userId,
      });
  
      if (!existingCartItem) {
        return response.status(404).json({
          message: "Cart item not found",
          success: false,
          error: true,
        });
      }
  
      // Update cart item quantity
      await CartProductModel.updateOne(
        { _id: cartItemId, userId },
        { $set: { quantity } }
      );
  
      return response.json({
        message: "Cart item updated successfully",
        success: true,
        error: false,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Internal Server Error",
        error: true,
        success: false,
      });
    }
  };
  
  export const deleteCartItemQtyController = async (request, response) => {
    try {
      const userId = request.userId; // Extract userId from middleware
      const { cartItemId } = request.body; 

      console.log('id and qnt',{ cartItemId});

      
      if (!cartItemId) {
        return response.status(400).json({
          message: "Provide cartItemId",
          error: true,
          success: false,
        });
      }
  
      // Check if the item exists before attempting to delete it
      const existingCartItem = await CartProductModel.findOne({
        _id: cartItemId,
        userId,
      });
  
      if (!existingCartItem) {
        return response.status(404).json({
          message: "Cart item not found",
          error: true,
          success: false,
        });
      }
  
      // Delete the cart item
      await CartProductModel.deleteOne({ _id: cartItemId, userId });
  
      return response.json({
        message: "Cart item removed successfully",
        error: false,
        success: true,
      });
  
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Internal Server Error",
        error: true,
        success: false,
      });
    }
  };
  