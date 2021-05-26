import { Router } from "express";
import UserRouter from "./user";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/v1/users", UserRouter);

// Export the base-router
export default router;
