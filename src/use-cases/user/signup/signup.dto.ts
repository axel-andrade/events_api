import { User } from "@entities";
export interface SignupResponseDTO {
  success: boolean;
  data?: User;
  failures?: Error[];
}
