import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/model/product';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { ProductRegisterComponent } from './product-register/product-register.component';
import { switchMap } from 'rxjs';
import { DialogConfirmComponent } from '../confirm/dialog-confirm/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent  implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'brand', 'price','actions'];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;
  constructor(private productService: ProductService,private dialog: MatDialog,public dialogConfirm: MatDialog,  private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(){
  this.productService.findAll().subscribe(data => {
      this.createTable(data);
  });
}

    applyFilter(e: any) {
      this.dataSource.filter = e.target.value.trim().toLowerCase();
    }


  openDialog(product? : Product){

    const dialogRef =  this.dialog.open(ProductRegisterComponent, {
      width: '250px',
      data: product
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.getProducts();
      }

    });
  }

  delete(idproduct: number){

    this.dialogConfirm.open(DialogConfirmComponent, {
      data: `¿Estimado usuario ,estas seguro que desea eliminar este registro?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.productService.delete(idproduct).pipe(switchMap( ()=> {
          return this.productService.findAll();
        }))
        .subscribe(data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('DELETED!');
          this.snackBar.open('Success delete', 'Splash', {duration:2000   });
          this.getProducts();
        });


      } else {

      }
    });
}

createTable(product: any){
  this.dataSource = new MatTableDataSource(product);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
}


