import {Entity, model, property} from '@loopback/repository';

@model({settings: {mongodb: {collection: 'books'}}})
export class Book extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  author?: string;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'number',
  })
  stock?: number;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;
