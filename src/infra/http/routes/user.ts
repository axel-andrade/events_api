import { Router } from "express";
import signup from "@infra/http/actions/user/signup";
import login from "@infra/http/actions/user/login";
import { createAction } from "../create-action";
import { adminAuth } from "../middlewares";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router
  .route("/update-password")
  .patch(adminAuth,createAction("updatePassword"));

export default router;
