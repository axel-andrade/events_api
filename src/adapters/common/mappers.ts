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
  find(criteria: any, attributes?: any): Promise<any | null>;
  findAll(criteria: any, attributes?: any): Promise<any | null>;
  insert(e: Entity<any>): Promise<void>;
  update(e: Entity<any>): Promise<void>;
  delete(e: Entity<any>): Promise<void>;
  upsert(e: Entity<any>): Promise<void>;
  insertCollection(entities: Entity<any>[]): Promise<void>;
  deleteByCriteria(criteria: any): Promise<void>;
  updateByCriteria(criteria: any, options: any): Promise<void>;
}

export interface TransactionalDataMappers {
  startTransaction(): Promise<void>;
  getEntityMapper(entityName: string): DataMapper;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}
