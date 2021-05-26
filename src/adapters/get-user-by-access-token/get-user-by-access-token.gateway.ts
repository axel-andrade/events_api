import BaseRepository from "../gateways/repositories/base-repository";
import MixUserRepository from "../gateways/repositories/user.rep";
import MixDecryterService from "../gateways/services/decrypter.service";

const GetUserByAccessTokenGateway = MixDecryterService(
  MixUserRepository(BaseRepository)
);

export default GetUserByAccessTokenGateway;