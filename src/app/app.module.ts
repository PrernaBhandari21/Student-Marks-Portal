import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from './shared/header/header.component';
import { SidemenuComponent } from './shared/sidemenu/sidemenu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomePageComponent } from './home-page/home-page.component';
import { NgMaterialMultilevelMenuModule, MultilevelMenuService } from "ng-material-multilevel-menu";
import { CreateReportComponent } from './create-report/create-report.component';
import { MarksListComponent } from './marks-list/marks-list.component';
import {MatTableModule} from '@angular/material/table';
import { ResultCalculationComponent } from './result-calculation/result-calculation.component';
import { SelectHeadersComponent } from './select-headers/select-headers.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { StudentPersonalReportComponent } from './student-personal-report/student-personal-report.component';

import { CdkTableModule } from '@angular/cdk/table';
import { HeaderDialogComponent } from './header-dialog/header-dialog.component';

import {MatIconModule} from '@angular/material/icon';
import { ExportAsModule } from 'ngx-export-as';
import { ExistingReportsListComponent } from './existing-reports-list/existing-reports-list.component';

import { HttpClientModule } from '@angular/common/http';
import { SelectReportComponent } from './select-report/select-report.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidemenuComponent,
    HomePageComponent,
    CreateReportComponent,
    MarksListComponent,
    ResultCalculationComponent,
    SelectHeadersComponent,
    StudentPersonalReportComponent,
    HeaderDialogComponent,
    ExistingReportsListComponent,
    SelectReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSidenavModule,
    NgMaterialMultilevelMenuModule,
    MatTableModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    CdkTableModule,
    ExportAsModule,
    HttpClientModule,
    MatSelectModule
  ],
  providers: [ MultilevelMenuService,
     
],  bootstrap: [AppComponent]
})
export class AppModule { }
