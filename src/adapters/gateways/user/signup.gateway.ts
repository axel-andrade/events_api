import BaseRepository from "../../common/repositories/base-repository";
import MixUserRepository from "../../common/repositories/user.rep";
import MixCryptographyService from "../../common/services/cryptography.service";

const SignupGateway = MixCryptographyService(MixUserRepository(BaseRepository));

export default SignupGateway;
