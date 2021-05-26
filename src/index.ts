import "./loadEnv"; // Must be the first import
import logger from "@shared/logger";
import { setupContainer } from "@infra/bootstrap/register";
import { UniqueEntityIDGeneratorFactory } from "@entities";
import UUIDEntityGenerator from "@infra/plugins/singleton/uuid-id-generator";
import { shutdownHttpServer, startHttpServer } from "@infra/http/http-server";

async function init() {
  try {
    const container = await setupContainer({});
    const uuidGenerator = container.resolve("uuidv4");
    logger.info("Container setup done");

    // init id factories
    const factories = {
      default: new UUIDEntityGenerator(uuidGenerator),
    };

    UniqueEntityIDGeneratorFactory.getInstance().initialize(factories);

    logger.info("Entity ID Generators initialized");

    startHttpServer({}, container);

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

  // try {
  //   unloadModels();
  //   logger.info("Database connections closed");
  // } catch (err) {
  //   logger.error("Databases shutdown error", { err });
  // }

  logger.info("Bye");
  process.exit(errorCode);
}

init();
