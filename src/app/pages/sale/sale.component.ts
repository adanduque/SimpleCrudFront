import { ProductService } from './../../services/product.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../model/product';
import {  switchMap } from 'rxjs';
import { Person } from '../../model/person';
import { PersonService } from '../../services/person.service';
import { Sale } from '../../model/sale';
import { SaleService } from '../../services/sale.service';
import { SaleDetail } from '../../model/saleDetail';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  products:Product[];
  persons:Person[];
  id: number;
  isEdit: boolean=false;
  form: FormGroup;
  textForm :string ='REGISTER';
  total:number=0;



  displayedColumns: string[] = ['id', 'person', 'date', 'total'];
  dataSource: MatTableDataSource<Sale>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productService: ProductService,
    private personService: PersonService,
    private snackBar: MatSnackBar,
    private elem: ElementRef,
    private renderer: Renderer2,
    private saleServie:SaleService,
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
       idSale : new FormControl(0),
       idPerson : new FormControl(0,[Validators.required,Validators.min(1)]),
       quantityDetail :new FormControl(0),
       productIdDetail:new FormControl(0),
       details : new FormArray([],[Validators.required])
    });
  this.getProducts();
  this.getPersons();
  this.getSales();


  }

  getSales(){
  this.saleServie.findAll().subscribe(data => {
      this.createTable(data);
  });
}

createTable(product: any){
  this.dataSource = new MatTableDataSource(product);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
  getProducts(){
    this.productService.findAll().subscribe(data => {
        this.products= data;
    });
  }
  getPersons(){
    this.personService.findAll().subscribe(data => {
        this.persons= data;
    });
  }



  get f() {
    return this.form.controls;
  }

  get fProduct() {
    return this.form.get('product')['controls'];
  }




  get details() {
    return this.form.get('details') as FormArray;
  }

  addDetail() {

    let productIdDetailValid = this.form.get('productIdDetail').valid;
    let quantityDetailValid  = this.form.get('quantityDetail').valid;
    let productIdDetailValue = +this.form.get('productIdDetail').value;
    let quantityDetailValue  = +this.form.get('quantityDetail').value;

    if( !quantityDetailValue || !productIdDetailValue || !quantityDetailValid || !productIdDetailValid ){
      this.snackBar.open('Enter the correct information', 'Splash', {duration:2000   });
      return;
    }
    if(quantityDetailValue <=0){
      this.snackBar.open('Quantity must be greater than zero', 'Splash', {duration:2000   });
      return;
    }


    let band = false;
    this.details.controls.forEach((element, index) => {

      if (element.get('idProduct').value === productIdDetailValue){
         band =true;
         return;
      }

    });
    if(!band){
      let product:Product = this.products.find(p => p.idProduct==productIdDetailValue);
      let subTotalp=Math.round(quantityDetailValue*product.price*100)/100;;
      this.details.push(
         new FormGroup(
        {
          idProduct : new FormControl( {value:productIdDetailValue, disabled: true},[Validators.required] ),
          product : new FormControl( {value:product.name, disabled: true},[Validators.required] ),
          quantity:new FormControl({value:quantityDetailValue, disabled: true},[Validators.required,Validators.min(0),Validators.pattern('^[0-9]+')]),
          price:new FormControl({value:product.price, disabled: true},[Validators.required,Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]),
          subTotal:new FormControl({value:subTotalp, disabled: true},[Validators.required])}

        )
        );
        this.form.get('productIdDetail').setValue(0);
        this.form.get('quantityDetail').setValue(0);
    }else{
      this.snackBar.open('Record already exists', 'Splash', {duration:2000   });

    }


  }
  writeSubTotal(i: number){
    if(!this.details.controls[i.toString()].get('quantity').valid  ||  !this.details.controls[i.toString()].get('price').valid    ){
      this.details.controls[i.toString()].get('subTotal').setValue(0);
    return;
    }

      let quantity:number= +this.details.controls[i.toString()].get('quantity').value;
      let price:number= +this.details.controls[i.toString()].get('price').value;
      let subTotalp=Math.round(quantity*price*100)/100;;
      this.details.controls[i.toString()].get('subTotal').setValue(subTotalp);




  }

  deleteDetail(i: number) {
    let personIdAnt = this.form.get('idPerson').value;
    this.details.removeAt(i);





  }

  getDisabled(i){
    return this.details.controls[i.toString()].get('quantity').enabled;
  }
  saveDetail(i: number){

   if(!this.details.controls[i.toString()].get('quantity').value
      || !this.details.controls[i.toString()].get('price').value
      || !this.details.controls[i.toString()].get('quantity').valid
      || !this.details.controls[i.toString()].get('price').valid
      ){
    this.snackBar.open('Empty or Invalid Value', 'Splash', {duration:2000   });
    return;
   }
    else{
      this.details.controls[i.toString()].get('quantity').disable();
      this.details.controls[i.toString()].get('price').disable();
    }

  }
  editDetail(i: number){


      this.details.controls[i.toString()].get('quantity').enable();
      this.details.controls[i.toString()].get('price').enable();
    //}


  }
  newSale(){
      for (let index = 0; index < this.details.length; index++) {
        this.details.removeAt(0);
      }
      this.details.removeAt(0);


    this.form.reset({
      idSale:0,
      idPerson:0,
      total:0,
      quantityDetail:0,
      productIdDetail:0,
      details:[]
    });

  }
  getTotal():number{

    let total=0;
    this.details.controls.forEach((element, index) => {


        total = total + (+element.get('subTotal').value);

    });

    return total;
  }

 operate() {
    if (this.form.invalid || this.details.length <=0) {
      this.snackBar.open('Verify data', 'Splash', {duration:2000   });
      return;
    }



    let sale = new Sale();
    let person =new Person();
    sale.idSale = this.form.value['idSale'];
    sale.datetime =  moment.utc().format('YYYY-MM-DDTHH:mm:ss');
    person.idPerson=this.form.value['idPerson'];
    sale.person= person ;

    let total=0;
    let datailsData=[];
    this.details.controls.forEach(element => {
        total = total + (+element.get('subTotal').value);

        let detail = new SaleDetail();
        let product =new Product();
        product.idProduct=element.get('idProduct').value;
        detail.product=product;
        detail.quantity= element.get('quantity').value;
        datailsData.push(detail);
      })
    sale.total = total;
    sale.details = datailsData;


      this.saleServie.save(sale).pipe(switchMap(()=>{
        return this.saleServie.findAll();
      }))
      .subscribe(data => {
        this.dataSource.data=data;
        this.saleServie.setSaleChange(data);

        this.saleServie.setMessageChange("CREATED!");
        this.snackBar.open('Success create', 'Splash', {duration:2000   });
        this.newSale();

      });

  }
  getControl(control):any{
   return control.controls.product;

  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

}
