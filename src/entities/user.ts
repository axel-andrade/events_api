import { Entity, UniqueEntityID } from "@entities";
import { Result } from "@shared/result";
import { RequiredFieldError } from "./errors";

export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  name: string;
  phone: string;
  role?: UserRoleEnum;
  password?: string;
  accessToken?: string;
  email: string;
  birthdate: Date;
}

export class User extends Entity<IUser> {
  get name(): string {
    return this.props.name;
  }

  get phone(): string {
    return this.props.phone;
  }

  get role(): string {
    return this.props.role;
  }

  get email(): string {
    return this.props.email;
  }

  get birthdate(): Date {
    return this.props.birthdate;
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  set accessToken(accessToken: string) {
    this.props.accessToken = accessToken;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  private constructor(props: IUser, id?: UniqueEntityID) {
    super(props, id);
  }

  public static validateProps(props: IUser): Array<Error> {
    /** some domain validations here **/
    const errors: Array<Error> = [];

    if (!props.name) {
      errors.push(new RequiredFieldError("name"));
    }

    if (!props.role) {
      errors.push(new RequiredFieldError("role"));
    }

    if (!props.email) {
      errors.push(new RequiredFieldError("email"));
    }

    if (!props.phone) {
      errors.push(new RequiredFieldError("phone"));
    }

    if (!props.birthdate) {
      errors.push(new RequiredFieldError("birthdate"));
    }

    /** put other validations here */

    return errors;
  }

  public static build(props: IUser, id?: UniqueEntityID): Result<User> {
    const errors = this.validateProps(props);

    if (errors.length > 0) {
      return Result.fail<User>(errors);
    }

    return Result.success<User>(new User(props, id));
  }
}
