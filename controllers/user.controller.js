import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from "../models/user.model.js";
import sendEmail from "../config/sendEmail.js"; 
import verifyEmailTemplate from "../utilis/verifyEmailtemplate.js"; 
import generatedAccessToken from "../utilis/generatedAccessToken.js";
import genertedRefreshToken from "../utilis/generatedRefreshToken.js";
import uploadImageClodinary from '../utilis/uploadImageClodinary.js';

import forgotPasswordTemplate from '../utilis/forgotPasswordTemplate.js';
import generatedOtp from '../utilis/generatedOpt.js';

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
        error: true,
        success: false,
      });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        error: true,
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate email verification link
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;

    // Send verification email
    await sendEmail({
      sendTo: email,
      subject: "Verify your email from Ecommerce",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    // Send success response (omit password)
    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      error: false,
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
      error: true,
      success: false,
    });
  }
};




export async function verifyEmailController(request,response){
  try {
      const { code } = request.body

      const user = await UserModel.findOne({ _id : code})

      if(!user){
          return response.status(400).json({
              message : "Invalid code",
              error : true,
              success : false
          })
      }

      const updateUser = await UserModel.updateOne({ _id : code },{
          verify_email : true
      })

      return response.json({
          message : "Verify email done",
          success : true,
          error : false
      })
  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : true
      })
  }
}


export async function loginController(request,response){
    try {
        const { email , password } = request.body


        if(!email || !password){
            return response.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcrypt.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}



//logout controller
export async function logoutController(request,response){
  try {
      const userid = request.userId //middleware

      const cookiesOption = {
          httpOnly : true,
          secure : true,
          sameSite : "None"
      }

      response.clearCookie("accessToken",cookiesOption)
      response.clearCookie("refreshToken",cookiesOption)

      const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
          refresh_token : ""
      })

      return response.json({
          message : "Logout successfully",
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

//upload user avatar
export async  function uploadAvatar(request,response){
  try {
      const userId = request.userId // auth middlware
      const image = request.file  // multer middleware
 
      const upload = await uploadImageClodinary(image)
      
      
      const updateUser = await UserModel.findByIdAndUpdate(userId,{
          avatar : upload.url
      })

      return response.json({
          message : "upload profile",
          success : true,
          error : false,
          data : {
              _id : userId,
              avatar : upload.url
          }
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}



//update user details
export async function updateUserDetails(request,response){
  try {
      const userId = request.userId //auth middleware
      const { name, email, mobile, password } = request.body 

      let hashPassword = ""

      if(password){
          const salt = await bcryptjs.genSalt(10)
          hashPassword = await bcryptjs.hash(password,salt)
      }

      const updateUser = await UserModel.updateOne({ _id : userId},{
          ...(name && { name : name }),
          ...(email && { email : email }),
          ...(mobile && { mobile : mobile }),
          ...(password && { password : hashPassword })
      })

      return response.json({
          message : "Updated successfully",
          error : false,
          success : true,
          data : updateUser
      })


  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}


// deleted user



export async function deleteUserById(req, res) {
    try {
        const { id } = req.params; // Get user ID from URL
        const requesterId = req.userId; // Authenticated user's ID (from middleware)

        // Ensure the user exists
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check if the requester is deleting their own account or an admin
        if (requesterId !== id) {
            return res.status(403).json({
                message: "Unauthorized to delete this user",
                error: true,
                success: false
            });
        }

        // Delete user
        await UserModel.findByIdAndDelete(id);

        return res.json({
            message: "User deleted successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

//forgot password not login
export async function forgotPasswordController(request,response) {
    try {
        const { email } = request.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from Binkeyit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return response.json({
            message : "check your email",
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


//verify forgot password otp
export async function verifyForgotPasswordOtp(request,response){
    try {
        const { email , otp }  = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
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

//reset the password
export async function resetpassword(request,response){
    try {
        const { email , newPassword, confirmPassword } = request.body 

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "Password updated successfully.",
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


//refresh token controler
export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }
console.log("refresh token", refreshToken)
        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }
        console.log("verify token", verifyToken)
        const userId = verifyToken?._id
        console.log("userif", userId)
        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//get login user details
export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}