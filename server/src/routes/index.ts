import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import trackingRouter from "./tracking.js";
import shipmentsRouter from "./shipments.js";
import dashboardRouter from "./dashboard.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(trackingRouter);
router.use(shipmentsRouter);
router.use(dashboardRouter);

export default router;
