import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../model/product';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.css']
})
export class ProductRegisterComponent implements OnInit {


  id: number;
  isEdit: boolean=false;
  form: FormGroup;
  textForm :string ='REGISTER';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'idProduct' : new FormControl(0),
      'name' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'brand' : new FormControl('', [Validators.required, Validators.minLength(4)]),
      'price' : new FormControl(0, [Validators.required,Validators.min(1), Validators.pattern('^[0-9]+')]),
    });

   if(this.data){
      this.textForm='UPDATE';
      this.id = this.data['idProduct'];
      this.isEdit = this.data['idProduct'] != null;
      console.log(this.isEdit)
      this.initForm();

   }




  }

  initForm(){
    if(this.isEdit){

      this.productService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idProduct' : new FormControl(data.idProduct),
          'name' : new FormControl(data.name, [Validators.required, Validators.minLength(3)]),
          'brand' : new FormControl(data.brand, [Validators.required, Validators.minLength(5)]),
          'price' : new FormControl(data.price, [Validators.required, Validators.min(0)]),

        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }



  onNoClick(cargar?:boolean): void {
    this.dialogRef.close(cargar);
  }

  operate() {
    if (this.form.invalid) { return; }

    let product = new Product();
    product.idProduct = this.form.value['idProduct'];
    product.name = this.form.value['name'];
    product.brand = this.form.value['brand'];
    product.price = this.form.value['price'];

    if (this.isEdit) {

      this.productService.update(product).subscribe(() => {
        this.productService.findAll().subscribe(data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('UPDATED!');
          this.snackBar.open('Success update', 'Splash', {duration:2000   });

        });
      });
    } else {

      this.productService.save(product).pipe(switchMap(()=>{
        return this.productService.findAll();
      }))
      .subscribe(data => {
        this.productService.setProductChange(data);
        this.productService.setMessageChange("CREATED!");
        this.snackBar.open('Success create', 'Splash', {duration:2000   });

      });
    }
    this.onNoClick(true);
  }



}
