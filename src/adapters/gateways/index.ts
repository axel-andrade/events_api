import BaseRepository from "./repositories/base-repository";
import MixUserRepository from "./repositories/user.rep";
import MixHasherService from "./services/hasher.service";
import MixEncryterService from "./services/encrypter.service";
import MixDecryterService from "./services/decrypter.service";

export * from "./services";
export { DataMapper, TransactionalDataMappers } from "./mappers";

/* User */
export const SignupGateway = MixHasherService(
  MixUserRepository(BaseRepository)
);

export const LoginGateway = MixHasherService(
  MixEncryterService(MixUserRepository(BaseRepository))
);