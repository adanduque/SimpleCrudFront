import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonComponent } from './pages/person/person.component';
import { ProductComponent } from './pages/product/product.component';
import { SaleComponent } from './pages/sale/sale.component';

const routes: Routes = [
  { path: 'pages/person', component: PersonComponent},
  { path: 'pages/product', component: ProductComponent },
  { path: 'pages/sale', component: SaleComponent },
  { path: '',  pathMatch:'full',redirectTo:'/pages/sale' },
  { path: '**', pathMatch:'full', redirectTo:'/pages/sale' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
