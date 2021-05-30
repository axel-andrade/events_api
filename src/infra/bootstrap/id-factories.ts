import { UniqueEntityIDGeneratorFactory } from "@entities";
import UUIDEntityIDGenerator from "@infra/plugins/singleton/uuid-id-generator";
import { AwilixContainer } from "awilix";

export function setupIdFactories(container: AwilixContainer) {
  const uuidGenerator = container.resolve("uuidv4");

  const factories = {
    default: new UUIDEntityIDGenerator(uuidGenerator),
  };

  UniqueEntityIDGeneratorFactory.getInstance().initialize(factories);
}
