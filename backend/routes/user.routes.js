import {Router} from "express";
import multer from "multer";
import {register,login, uploadProfilePicture,updateUserProfile,
   getUserAndProfile, updateProfileData, getAllUserProfile,
   downloadProfile,
   sendConnectionRequest,
   getMyConnectionsRequests,
   whatAreMyConnections,
   acceptConnectionRequest,
   getUserProfileAndUserBasedOnUsername} from "../controllers/user.controller.js";


const router = Router();

const storage = multer.diskStorage({
    destination :(req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage:storage });

router.route("/update_profile_picture")
.post(
  (req, res, next) => {
    upload.single("profile_picture")(req, res, (err) => {
      if (err) {
        console.log("MULTER ERROR:", err.message, "| FIELD:", err.field);
        return res.status(400).json({ error: err.message, field: err.field });
      }
      next();
    });
  },
  uploadProfilePicture
);


router.route('/register').post(register);
router.route("/login").post(login)
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile)
router.route("/update_profile_data").post(updateProfileData)
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/send_connection_request").get(getMyConnectionsRequests);
router.route("/user/send_connection_request").get(whatAreMyConnections);
router.route("/user/send_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername)


export default router;