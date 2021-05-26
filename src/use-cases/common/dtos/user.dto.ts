import { UserRoleEnum } from "@entities";

export interface UserDTO {
  name: string;
  phone: string;
  email: string;
  birthdate: Date;
  role: UserRoleEnum;
}
