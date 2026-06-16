import {Entity, model, property} from '@loopback/repository';

@model({settings: {mongodb: {collection: 'payments'}}})
export class Payment extends Entity {
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
  orderId: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'string',
  })
  paymentDate?: string;

  @property({
    type: 'string',
  })
  paymentMethod?: string;

  @property({
    type: 'string',
    default: 'pending',
  })
  status?: string;

  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  // describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;
