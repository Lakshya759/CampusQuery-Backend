import {Router} from "express"
import {createPost,viewSinglePost,updatePost,deletePost,viewAllPost,viewTags} from "../controllers/post.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router()


router.route("/create").post(verifyJWT,createPost)

router.route("/view").get(verifyJWT,viewAllPost)

router.route("/view/:id").get(viewSinglePost);

router.route("/update/:id").put(verifyJWT, updatePost);

router.route("/delete/:id").delete(verifyJWT, deletePost);

router.route("/view/tags").post(verifyJWT, viewTags);




export default router