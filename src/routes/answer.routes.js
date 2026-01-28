import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {createAnswer,getAnswerByPost,toggleUpvote} from "../controllers/answer.controller.js"


const router = Router()


router.route("/create/:postId").post(verifyJWT,createAnswer)
router.route("/:postId").get(verifyJWT,getAnswerByPost)
router.route("/upvote/:answerId").patch(verifyJWT,toggleUpvote)



export default router