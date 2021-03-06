import { ValueObject } from "@entities";
import { Result } from "@shared/result";
import { TooShortError } from "./errors/too-short.error";

export interface IAddressProps {
  street: string;
  neighborhood: string;
  city: string;
  number: string;
  state: string;
  country: string;
  complement: string;
  zipcode: string;
}

export class Address extends ValueObject<IAddressProps> {
  get street(): string {
    return this.props.street;
  }

  get neighborhood(): string {
    return this.props.neighborhood;
  }

  get city(): string {
    return this.props.city;
  }

  get number(): string {
    return this.props.number;
  }

  get state(): string {
    return this.props.state;
  }

  get country(): string {
    return this.props.country;
  }

  get complement(): string {
    return this.props.complement;
  }

  get zipcode(): string {
    return this.props.zipcode;
  }

  private constructor(props: IAddressProps) {
    super(props);
  }

  public toValue(): IAddressProps {
    return {
      street: this.street,
      neighborhood: this.neighborhood,
      city: this.city,
      number: this.number,
      state: this.state,
      country: this.country,
      complement: this.complement,
      zipcode: this.zipcode,
    };
  }

  public static build(props: IAddressProps): Result<Address> {
    /** some domain validations here **/

    let errors: Array<Error> = [];

    if (!props.street || props.street.length < 2) {
      errors.push(new TooShortError("street", 2));
    }

    /** put some other validations here */

    if (errors.length > 0) {
      return Result.fail<Address>(errors);
    }

    return Result.success<Address>(new Address(props));
  }
}
