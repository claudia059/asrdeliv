import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import trackingRouter from "./tracking";
import shipmentsRouter from "./shipments";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(trackingRouter);
router.use(shipmentsRouter);
router.use(dashboardRouter);

export default router;
