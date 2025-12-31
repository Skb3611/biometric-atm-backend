import Router from "express";
import DashboardRouter from "./dashboard-router";
import AuthRouter from "./auth-router";
import { authMiddleware } from "../middleware/auth-middlewware";
const router = Router();
router.use("/dashboard", authMiddleware, DashboardRouter);
router.use("/auth", AuthRouter);
export default router;
