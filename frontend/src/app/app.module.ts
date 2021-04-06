import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { CollectionComponent } from './collection/collection.component';
import { NgTableComponent } from './shared/components/table/ng-table.component';
import { NgbModule, NgbPaginationModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgTableFilteringDirective } from './shared/components/table/ng-table-filtering.directive';
import { NgTablePagingDirective } from './shared/components/table/ng-table-paging.directive';
import { NgTableSortingDirective } from './shared/components/table/ng-table-sorting.directive';
import { HeaderComponent } from './header/header.component';
import { CollectionService } from './services/collection.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalPopupComponent } from './shared/components/popup/modal-popup/modal-popup.component';
import { CollectionEditComponent } from './collection/edit/collection-edit.component';
import { CollectionDetailComponent } from './collection/detail/collection-detail.component';
import { NgxBootstrapConfirmModule } from 'ngx-bootstrap-confirm';
import { SetdataComponent } from './setdata/setdata.component';
import { PartdataComponent } from './partdata/partdata.component';
import { RunComponent } from './run/run.component';
import { RunEditComponent } from './run/run-edit/run-edit.component';
import { SorterComponent } from './sorter/sorter.component';
import { SorterEditComponent } from './sorter/edit/sorter-edit.component';
import { SorterDetailComponent } from './sorter/detail/sorter-detail.component';
import { PusherEditComponent } from './sorter/pusher-edit/pusher-edit.component';
import { ValveEditComponent } from './sorter/valve-edit/valve-edit.component';
import { ScaleEditComponent } from './sorter/scale-edit/scale-edit.component';
import { RunDetailComponent } from './run/run-detail/run-detail.component';
import { SortedsetEditComponent } from './run/sortedset-edit/sortedset-edit.component';
import { IdentifiedpartEditComponent } from './run/identifiedpart-edit/identifiedpart-edit.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserComponent } from './preferences/user/user.component';
import { UserEditComponent } from './preferences/user/user-edit/user-edit.component';
import { NgbdSortableHeader } from './shared/components/table/sortable.directive';
import { NgFilterPipe } from './shared/components/table/ng-filter.pipe';
import { UsergroupComponent } from './preferences/usergroup/usergroup.component';
import { UsergroupEditComponent } from './preferences/usergroup/usergroup-edit/usergroup-edit.component';
import { StatusComponent } from './preferences/status/status.component';
import { StatusEditComponent } from './preferences/status/status-edit/status-edit.component';
import { TypesComponent } from './preferences/types/types.component';
import { TypesEditComponent } from './preferences/types/types-edit/types-edit.component';
import { ColorsComponent } from './colors/colors.component';
import { CategoriesComponent } from './categories/categories.component';
import { PricesComponent } from './prices/prices.component';
import { SetDetailComponent } from './setdata/set-detail/set-detail.component';
import { CardComponent } from './shared/components/card/card.component';
import { LabelpartsComponent } from './labelparts/labelparts.component';
import { OfferComponent } from './offer/offer.component';
import { OfferDetailComponent } from './offer/offer-detail/offer-detail.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { LinkSetnumbersPipe } from './shared/components/pipes/link-setnumbers/link-setnumbers.pipe';
import { RunAddEditComponent } from './run/run-add-edit/run-add-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CollectionComponent,
    NgTableComponent,
    NgTableFilteringDirective,
    NgTablePagingDirective,
    NgTableSortingDirective,
    NgbdSortableHeader,
    HeaderComponent,
    ModalPopupComponent,
    CollectionEditComponent,
    CollectionDetailComponent,
    SetdataComponent,
    PartdataComponent,
    RunComponent,
    RunEditComponent,
    SorterComponent,
    SorterEditComponent,
    SorterDetailComponent,
    PusherEditComponent,
    ValveEditComponent,
    ScaleEditComponent,
    RunDetailComponent,
    SortedsetEditComponent,
    IdentifiedpartEditComponent,
    PreferencesComponent,
    UserComponent,
    UserEditComponent,
    NgFilterPipe,
    UsergroupComponent,
    UsergroupEditComponent,
    StatusComponent,
    StatusEditComponent,
    TypesComponent,
    TypesEditComponent,
    ColorsComponent,
    CategoriesComponent,
    PricesComponent,
    SetDetailComponent,
    CardComponent,
    LabelpartsComponent,
    OfferComponent,
    OfferDetailComponent,
    LinkSetnumbersPipe,
    RunAddEditComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbPopoverModule,
    NgbTooltipModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxBootstrapConfirmModule,
    DragDropModule,
    MatExpansionModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  providers: [AuthGuardService,CollectionService, NgFilterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
