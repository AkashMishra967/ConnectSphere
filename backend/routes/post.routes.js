import {Router} from "express";
import { activeCheck,createPost,deletePost,getAllPost } from "../controllers/post.controller.js";
import multer from "multer";



const router = Router();

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null, 'uploads/')
    },
    filename:(req,file,cb) =>{
        cb(null, file.originalname)
    },
})


const upload = multer({storage:storage})



router.route('/').get(activeCheck);

router.route('/post').post(upload.single('media'),createPost)
router.route("/posts").get(getAllPost)
router.route("/delete_post").post(deletePost)

export default router;