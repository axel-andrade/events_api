import http from "http";
import httpShutdown from "http-shutdown";
import cookieParser from "cookie-parser";
import express from "express";
import { AwilixContainer } from "awilix";
import cors from "cors";
import requestIdMdw from "./middlewares/request-id";
import routes from "./routes";
import logger from "@shared/logger";
import { User } from "@entities";

declare global {
  namespace Express {
    export interface Request {
      id: string;
      container: AwilixContainer;
      currentUser: Partial<User>;
    }

    export interface Response {
      reqStartedAt: number;
    }
  }
}

let server: http.Server = null;

export const startHttpServer = (
  config: any,
  container: AwilixContainer
): void => {
  if (server) {
    throw new Error("HTTP Server already started");
  }

  let app = express();

  app.disable("x-powered-by");
  app.enable("trust proxy");

  app.route("/healthcheck").get((req, res) => res.status(200).end());

  app.use(requestIdMdw(container));
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Add APIs
  app.use("/api", routes);

  server = httpShutdown(http.createServer(app));

  const KEEPALIVE_SECONDS = 65;
  server.keepAliveTimeout = KEEPALIVE_SECONDS * 1000;
  server.headersTimeout = (KEEPALIVE_SECONDS + 5) * 1000;

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    logger.info(`HTTP server listening on port ${port}`);
  });
};

export const shutdownHttpServer = async (): Promise<void> => {
  if (!server) {
    return;
  }

  const s: any = server;

  return new Promise((resolve, reject) => {
    s.shutdown((err: Error) => {
      server = null;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
