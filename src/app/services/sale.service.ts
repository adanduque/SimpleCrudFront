import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Sale } from '../model/sale';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends GenericService<Sale> {


  private saleChange = new Subject<Sale[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/sales`
    );
  }

  //////////get set/////////////
  setSaleChange(list: Sale[]) {
    this.saleChange.next(list);
  }

  getSaleChange() {
    return this.saleChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
  }

