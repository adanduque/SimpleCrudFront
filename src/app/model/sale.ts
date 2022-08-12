import { Person } from './person';
import {  SaleDetail } from './saleDetail';

export class Sale {
  idSale: number;
  datetime: string;
  person: Person;
  total:number;
  details:SaleDetail[];
}
