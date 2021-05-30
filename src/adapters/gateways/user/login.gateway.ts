import BaseRepository from "../../common/repositories/base-repository";
import MixUserRepository from "../../common/repositories/user.rep";
import MixCryptography from "../../common/services/cryptography.service";
import MixHasher from "../../common/services/hasher.service";

const LoginGateway = MixHasher(
  MixCryptography(MixUserRepository(BaseRepository))
);

export default LoginGateway;
