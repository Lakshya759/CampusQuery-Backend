import {Router} from "express";
import {signUpUser,registerUser,loginUser,logoutUser,refreshAccessToken,getUser} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/signup").post(signUpUser)
router.route("/verify-email").get(registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/user").get(verifyJWT,getUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


export default router