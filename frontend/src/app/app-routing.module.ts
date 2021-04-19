import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { CollectionComponent } from './collection/collection.component';
import { CollectionDetailComponent } from './collection/detail/collection-detail.component';
import { LoginComponent } from './login/login.component';
import { PartdataComponent } from './partdata/partdata.component';
import { SetdataComponent } from './setdata/setdata.component';
import { RunComponent } from './run/run.component';
import { SorterComponent } from './sorter/sorter.component';
import { SorterDetailComponent } from './sorter/detail/sorter-detail.component';
import { RunDetailComponent } from './run/run-detail/run-detail.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ColorsComponent } from './colors/colors.component';
import { CategoriesComponent } from './categories/categories.component';
import { PricesComponent } from './prices/prices.component';
import { SetDetailComponent } from './setdata/set-detail/set-detail.component';
import { LabelpartsComponent } from './labelparts/labelparts.component';
import { OfferComponent } from './offer/offer.component';
import { OfferDetailComponent } from './offer/offer-detail/offer-detail.component';
import { RunAddEditComponent } from './run/run-add-edit/run-add-edit.component';
import { UserDetailComponent } from './offer/user-detail/user-detail.component';

const routes: Routes = [

  {path:'',redirectTo:"/login",pathMatch:"full"},
  {path:'login',component:LoginComponent},
  {path:'collection',component:CollectionComponent,canActivate:[AuthenticationGuard]},
  {path:'collectiondetail/:id',component:CollectionDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'setdata',component:SetdataComponent,canActivate:[AuthenticationGuard]},
  {path:'setdetail/:id',component:SetDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'partdata',component:PartdataComponent,canActivate:[AuthenticationGuard]},
  {path:'run',component:RunComponent,canActivate:[AuthenticationGuard]},
  {path:'addRun',component:RunAddEditComponent,canActivate:[AuthenticationGuard]},
  {path:'rundetail/:id',component:RunDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'hardware',component:SorterComponent,canActivate:[AuthenticationGuard]},
  {path:'sortersdetail/:id',component:SorterDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'preferences',component:PreferencesComponent,canActivate:[AuthenticationGuard]},
  {path:'colors',component:ColorsComponent,canActivate:[AuthenticationGuard]},
  {path:'categories',component:CategoriesComponent,canActivate:[AuthenticationGuard]},
  {path:'prices',component:PricesComponent,canActivate:[AuthenticationGuard]},
  {path:'labelparts/:runid',component:LabelpartsComponent,canActivate:[AuthenticationGuard]},
  {path:'offer',component:OfferComponent,canActivate:[AuthenticationGuard]},
  {path:'offerdetail/:id',component:OfferDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'offeruser/:id',component:UserDetailComponent,canActivate:[AuthenticationGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
