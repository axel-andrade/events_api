import { User } from "@entities";

export interface LoginResponseDTO {
  success: boolean;
  data?: User;
  failures?: Error[];
}
