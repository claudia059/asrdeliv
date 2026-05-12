import { httpServer } from "./app.js";
import { logger } from "./lib/logger.js";
import seed from "./lib/seed.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

seed()
  .then(() => {
    httpServer.listen(port, () => {
      logger.info({ port }, "Server listening");
    });
  })
  .catch((err: Error) => {
    logger.error({ err }, "Error seeding database");
    process.exit(1);
  });
