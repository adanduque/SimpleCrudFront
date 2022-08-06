import { Product } from '../model/product';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {


private productChange = new Subject<Product[]>;
private messageChange = new Subject<string>;

constructor(protected override http: HttpClient) {
  super(
    http,
    `${environment.HOST}/products`
  );
}

//////////get set/////////////
setProductChange(list: Product[]) {
  this.productChange.next(list);
}

getProductChange() {
  return this.productChange.asObservable();
}

setMessageChange(message: string) {
  this.messageChange.next(message);
}

getMessageChange() {
  return this.messageChange.asObservable();
}
}

