import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonComponent } from './pages/person/person.component';
import { ProductComponent } from './pages/product/product.component';

const routes: Routes = [
  { path: 'pages/person', component: PersonComponent},
  { path: 'pages/product', component: ProductComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
