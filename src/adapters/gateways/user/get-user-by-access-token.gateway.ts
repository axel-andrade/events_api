import BaseRepository from "../../common/repositories/base-repository";
import MixUserRepository from "../../common/repositories/user.rep";
import MixCryptographyService from "../../common/services/cryptography.service";

const GetUserByAccessTokenGateway = MixCryptographyService(
  MixUserRepository(BaseRepository)
);

export default GetUserByAccessTokenGateway;