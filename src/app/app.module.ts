import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonComponent } from './pages/person/person.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductRegisterComponent } from './pages/product/product-register/product-register.component';
import { DialogConfirmComponent } from './pages/confirm/dialog-confirm/dialog-confirm.component';
import { PersonRegisterComponent } from './pages/person/person-register/person-register.component';
import { SaleComponent } from './pages/sale/sale.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonComponent,
    ProductComponent,
    ProductRegisterComponent,
    DialogConfirmComponent,
    PersonRegisterComponent,
    SaleComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
