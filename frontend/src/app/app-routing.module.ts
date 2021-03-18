import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { CollectionComponent } from './collection/collection.component';
import { CollectionDetailComponent } from './collection/detail/collection-detail.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [

  {path:'',redirectTo:"/login",pathMatch:"full"},
  {path:'login',component:LoginComponent},
  {path:'collection',component:CollectionComponent,canActivate:[AuthenticationGuard]},
  {path:'collectiondetail/:id',component:CollectionDetailComponent,canActivate:[AuthenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
