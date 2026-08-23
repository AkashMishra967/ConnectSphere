import {Router} from "express";
import { activeCheck,createPost,deletePost,increment_share,getAllPost, get_comments_by_post,delete_comment_of_user, increment_likes, postComment } from "../controllers/post.controller.js";
import multer from "multer";



const router = Router();
import { storage } from "../config/cloudinary.js";
const upload = multer({storage:storage})






router.route('/').get(activeCheck);

router.route('/post').post(upload.single('media'),createPost)
router.route("/posts").get(getAllPost)
router.route("/delete_post").delete(deletePost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);
router.route("/post_comment").post(postComment);
router.route("/increment_share").post(increment_share);

export default router;