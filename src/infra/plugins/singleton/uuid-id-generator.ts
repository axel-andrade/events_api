import { UniqueEntityID, UniqueEntityIDGenerator } from "@entities";

export default class UUIDUniqueEntityIDGenerator
  implements UniqueEntityIDGenerator
{
  constructor(private readonly uuidGenerator: any) {}

  public nextId(): UniqueEntityID {
    return new UniqueEntityID(this.uuidGenerator());
  }
}
