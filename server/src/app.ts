import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { rateLimit } from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import router from "./routes";
import { logger } from "./lib/logger";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.set("trust proxy", 1);
export const httpServer = createServer(app);
export const io = new SocketServer(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] },
  path: "/api/socket.io",
});

app.use(helmet({ contentSecurityPolicy: true }));
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api", router);

export default app;
