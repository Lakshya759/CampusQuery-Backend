import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/brevo.js";




const generateAccessAndReferenceToken=async (userId)=>{
    try {
        const user =await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something Went Wrong while generating the tokens")
    }
}



const signUpUser =asyncHandler(async (req,res)=>{
    const { name , email , password , branch, year, skills  }=req.body


    //checking if the information is not empty
    if(
        [name , email, password, branch, year ].some((field)=> field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    
    //Checking if the user is using the college email id
    const collegeDomain="ietlucknow.ac.in"
    if(!email.endsWith(`@${collegeDomain}`)){
        throw new ApiError(500,"Please login through via college E-mail id only");
    }

    //Checking if the user already existed
    const existedUser=await User.findOne({email});
    if(existedUser){
        throw new ApiError(400, "Email Id is already registered")
    }
    //Generating verification token and saving it to database
    const token = jwt.sign({ email,name, password,branch,year,skills}, process.env.VERIFICATION_TOKEN_SECRET, { expiresIn: '15m' });
    
    
   



    const verifyUrl = `https://campusquery-backend-kvnf.onrender.com/api/v1/users/verify-email?token=${token}`;
    await sendEmail({
        to: req.body.email,
        subject: "Verify your college email",
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    });


    return res.status(200).json(
        new ApiResponse(200,{}, "Verification Link Has Been Sent To Your College Email")
    )

})

const registerUser=asyncHandler(async (req,res)=>{
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);

    const { email,name, password,branch , year,skills } = decoded;

    const existingUser= await User.findOne({email})

    if(existingUser){
        throw new ApiError(400,"Email already exists ")
    }


    const user=await User.create({
        email,password,name,branch,year,skills
    })
    
    return res
    // .status(200)
    // .json(
    //     new ApiResponse(200,{},"The User Has Been Verified And Registred Successfully")
    // )
    .send(
        "<h1 style='font-size: 28px; color: #4F46E5; font-weight: 600; margin-top: 20px;'>VERIFICATION SUCCECSSFUL</h1>"
    )


})

const loginUser = asyncHandler(async(req,res)=>{

    const {email,password}=req.body

    if(!email){
        throw new ApiError(400,"email is required ")
    }

    const user =await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid =await user.comparePassword(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndReferenceToken(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    
    const options={
        httpOnly:true,
        secure: true,
        sameSite: "none"
    }


    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )





})


const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure: false,
        sameSite: "lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"))


    
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user=User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:false,
            sameSite: "lax"
        }
        const {accessToken,newRefreshToken}=await generateAccessAndReferenceToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access Token Refreshed Successfully"
    
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message ||"invalid refresh token" )
        
    }
})

const getUser=asyncHandler(async(req,res)=>{
    const users=req.user;
    console.log(users)

    if(users){
        return res
        .status(200)
        .json(
                new ApiResponse(
                    200,
                    users,
                    "User Fetched Successfully"
                )
            )
    }
    else{
        throw new ApiError(400,"User Not Found")
    }
})





export {signUpUser,registerUser,loginUser,logoutUser,refreshAccessToken,getUser}