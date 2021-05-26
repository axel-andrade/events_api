import { Entity } from "@entities";

/*
Um Data Mapper é uma camada de Mapeadores que move dados entre objetos e um banco de dados, 
mantendo-os independentes uns dos outros e do próprio mapeador.

A camada de adaptadores define interfaces para estes Data Mappers, de modo a garantir a inversão 
do fluxo de dependência. Considerando que todas as entidades da aplicação serão armazenadas em 
tabelas de bancos de dados relacionais, é necessário definir interfaces para os comportamentos 
que esperamos de um BD relacional.

Ref: https://martinfowler.com/eaaCatalog/dataMapper.html
*/

export interface DataMapper {
  find(criteria: any): Promise<Entity<any>>;
  findAll(criteria: any): Promise<Entity<any>[]>;
  insert(e: Entity<any>): Promise<void>;
  update(e: Entity<any>): Promise<void>;
  delete(e: Entity<any>): Promise<void>;
}

export interface TransactionalDataMappers {
  startTransaction(): Promise<void>;
  getEntityMapper(entity: string): DataMapper;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}
