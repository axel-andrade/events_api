import "./loadEnv"; // Must be the first import
const moduleAlias = require("module-alias");

moduleAlias.addAlias("infra", __dirname + "/infra");
moduleAlias.addAlias("@infra", __dirname + "/infra");
moduleAlias.addAlias("@adapters", __dirname + "/adapters");
moduleAlias.addAlias("@usecases", __dirname + "/use-cases");
moduleAlias.addAlias("@entities", __dirname + "/entities");
moduleAlias.addAlias("@shared", __dirname + "/shared");
moduleAlias.addAlias("@constants", __dirname + "/constants");

import logger from "@shared/logger";
import { setupContainer } from "@infra/bootstrap/register";
import { shutdownHttpServer, startHttpServer } from "@infra/http/http-server";
import { loadModels, unloadModels } from "@infra/db/models";
import { setupIdFactories } from "@infra/bootstrap/id-factories";
import { getConfig } from "@infra/config/config";

async function init() {
  try {
    const config = await getConfig();
    await loadModels(config);
    const container = await setupContainer(config);
    logger.info("Container setup done");
    setupIdFactories(container);
    logger.info("Entity ID Generators initialized");
    startHttpServer(config, container);
    logger.info("Bootstrapped");
  } catch (err) {
    logger.error("Bootstrap error", { err });
    shutdown("ERROR", 1);
  }
}

async function shutdown(signal: string, errorCode = 0) {
  logger.info("Shutting down on " + signal);

  const stopHttpServer = async () => {
    try {
      await shutdownHttpServer();
      logger.info("HTTP server closed");
    } catch (err) {
      logger.error("HTTP server shutdown error", { err });
    }
  };

  // @ts-ignore
  await Promise.allSettled([stopHttpServer()]);

  try {
    unloadModels();
    logger.info("Database connections closed");
  } catch (err) {
    logger.error("Databases shutdown error", { err });
  }

  logger.info("Bye");
  process.exit(errorCode);
}

init();
