import BaseRepository from "../../common/repositories/base-repository";
import MixUserRepository from "../../common/repositories/user.rep";

const UpdatePasswordGateway = MixUserRepository(BaseRepository);

export default UpdatePasswordGateway;
