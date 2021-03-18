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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CollectionComponent,
    NgTableComponent,
    NgTableFilteringDirective,
    NgTablePagingDirective,
    NgTableSortingDirective,
    HeaderComponent,
    ModalPopupComponent,
    CollectionEditComponent,
    CollectionDetailComponent
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
    ToastrModule.forRoot()
  ],
  providers: [AuthGuardService,CollectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
