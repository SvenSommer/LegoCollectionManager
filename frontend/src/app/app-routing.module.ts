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
import { PartnamefrequencyComponent } from './preferences/partnamefrequency/partnamefrequency.component';
import { PartdataDetailComponent } from './partdata/partdata-detail/partdata-detail.component';
import { LabelsComponent } from './labels/labels/labels.component';
import { RunnedSetDetailComponent } from './runnedset/runnedset-detail/runnedset-detail.component';
import { RunnedSetComponent } from './runnedset/runnedset.component';
import { ExpectedsetComponent } from './expectedset/expectedset.component';
import { ExpectedsetDetailComponent } from './expectedset/expectedset-detail/expectedset-detail.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { OrderitemDetailComponent } from './orderitem/orderitem-detail/orderitem-detail.component';

const routes: Routes = [

  {path:'',redirectTo:"/login",pathMatch:"full"},
  {path:'login',component:LoginComponent},
  {path:'collection',component:CollectionComponent,canActivate:[AuthenticationGuard]},
  {path:'collectiondetail/:id',component:CollectionDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'setdata',component:SetdataComponent,canActivate:[AuthenticationGuard]},
  {path:'setdetail/:id',component:SetDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'expectedset',component:ExpectedsetComponent,canActivate:[AuthenticationGuard]},
  {path:'expectedsetdetail/:id',component:ExpectedsetDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'runnedset',component:RunnedSetComponent,canActivate:[AuthenticationGuard]},
  {path:'runnedsetdetail/:id',component:RunnedSetDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'partdata',component:PartdataComponent,canActivate:[AuthenticationGuard]},
  {path:'partdetail/:partno',component:PartdataDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'run',component:RunComponent,canActivate:[AuthenticationGuard]},
  {path:'addRun',component:RunAddEditComponent,canActivate:[AuthenticationGuard]},
  {path:'rundetail/:id',component:RunDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'hardware',component:SorterComponent,canActivate:[AuthenticationGuard]},
  {path:'sortersdetail/:id',component:SorterDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'preferences',component:PreferencesComponent,canActivate:[AuthenticationGuard]},
  {path:'preferences/partnamesfrequency',component:PartnamefrequencyComponent,canActivate:[AuthenticationGuard]},
  {path:'colors',component:ColorsComponent,canActivate:[AuthenticationGuard]},
  {path:'categories',component:CategoriesComponent,canActivate:[AuthenticationGuard]},
  {path:'prices',component:PricesComponent,canActivate:[AuthenticationGuard]},
  {path:'labelparts/:runid',component:LabelpartsComponent,canActivate:[AuthenticationGuard]},
  {path:'labelparts/:runid/:partid',component:LabelpartsComponent,canActivate:[AuthenticationGuard]},
  {path:'offer',component:OfferComponent,canActivate:[AuthenticationGuard]},
  {path:'offerdetail/:id',component:OfferDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'offeruser/:id',component:UserDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'label/:runid',component:LabelsComponent,canActivate:[AuthenticationGuard]},
  {path:'order',component:OrderComponent,canActivate:[AuthenticationGuard]},
  {path:'orderdetail/:id',component:OrderDetailComponent,canActivate:[AuthenticationGuard]},
  {path:'orderitemdetail/:id',component:OrderitemDetailComponent,canActivate:[AuthenticationGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
