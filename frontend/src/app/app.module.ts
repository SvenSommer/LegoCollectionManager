import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { CollectionComponent } from './collection/collection.component';
import { NgTableComponent } from './shared/components/table/ng-table.component';
import { NgbModule, NgbPaginationModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { RunnedSetEditComponent } from './run/runnedset-edit/runnedset-edit.component';
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
import { DragDropModule} from '@angular/cdk/drag-drop';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatInputModule} from '@angular/material/input';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { LinkSetnumbersPipe } from './shared/components/pipes/link-setnumbers/link-setnumbers.pipe';
import { RunAddEditComponent } from './run/run-add-edit/run-add-edit.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserDetailComponent } from './offer/user-detail/user-detail.component';
import { CardTableComponent } from './shared/components/card-table/card-table.component';
import { AccountsComponent } from './offer/accounts/accounts.component';
import { PartnamefrequencyComponent } from './preferences/partnamefrequency/partnamefrequency.component';
import { MatTabsModule} from '@angular/material/tabs';
import { MatMenuModule} from '@angular/material/menu';
import { MatIconModule} from '@angular/material/icon';
import { MatSelectModule} from '@angular/material/select';
import { MatCheckboxModule} from '@angular/material/checkbox';

import { AgGridModule } from 'ag-grid-angular';
import { GridComponent } from './shared/components/grid/grid.component';
import { ImagesCellComponent } from './shared/components/grid/images-cell/images-cell.component';
import { TextCellComponent } from './shared/components/grid/text-cell/text-cell.component';
import { DescriptionCellComponent } from './shared/components/grid/description-cell/description-cell.component';
import { DeleteCellComponent } from './shared/components/grid/delete-cell/delete-cell.component';
import { AdvancedSearchComponent } from './shared/components/advanced-search/advanced-search.component';
import { MatChipsModule} from '@angular/material/chips';
import { PartdataDetailComponent } from './partdata/partdata-detail/partdata-detail.component';
import { LabelsComponent } from './labels/labels/labels.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { RunnedSetComponent } from './runnedset/runnedset.component';
import { RunnedSetDetailComponent } from './runnedset/runnedset-detail/runnedset-detail.component';
import { LabelCellComponent } from './shared/components/grid/label-cell/label-cell.component';
import { ExpectedsetComponent } from './expectedset/expectedset.component';
import { ExpectedsetDetailComponent } from './expectedset/expectedset-detail/expectedset-detail.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { OrderitemDetailComponent } from './orderitem/orderitem-detail/orderitem-detail.component';
import { PurchasedPartEditComponent } from './orderitem/purchasedpart-edit/purchasedpart-edit.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);



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
    RunnedSetEditComponent,
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
    RunAddEditComponent,
    UserDetailComponent,
    CardTableComponent,
    AccountsComponent,
    PartnamefrequencyComponent,
    GridComponent,
    AdvancedSearchComponent,
    PartdataDetailComponent,
    ImagesCellComponent,
    TextCellComponent,
    DescriptionCellComponent,
    DeleteCellComponent,
    LabelsComponent,
    RunnedSetComponent,
    RunnedSetDetailComponent,
    LabelCellComponent,
    ExpectedsetComponent,
    ExpectedsetDetailComponent,
    OrderComponent,
    OrderDetailComponent,
    OrderitemDetailComponent,
    PurchasedPartEditComponent
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
    ReactiveFormsModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule,
    NgxChartsModule,
    AgGridModule.withComponents([
      ImagesCellComponent,
      TextCellComponent,
      DescriptionCellComponent,
      DeleteCellComponent
    ])
  ],
  providers: [AuthGuardService, CollectionService, NgFilterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
