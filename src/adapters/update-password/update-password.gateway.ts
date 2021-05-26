import BaseRepository from "../gateways/repositories/base-repository";
import MixUserRepository from "../gateways/repositories/user.rep";

const UpdatePasswordGateway = MixUserRepository(BaseRepository);

export default UpdatePasswordGateway;