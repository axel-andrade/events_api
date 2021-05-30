import { Router } from "express";
// import signup from "@infra/http/actions/user/signup";
import { createAction } from "../create-action";
import { adminAuth, auth } from "../middlewares";

const router = Router();

// router.route("/signup").post(signup);
router.route("/login").post(createAction("login"));
router.route("/update-password").patch(auth, createAction("updatePassword"));

export default router;
