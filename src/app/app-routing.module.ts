import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { MarksListComponent } from './marks-list/marks-list.component';
import { ResultCalculationComponent } from './result-calculation/result-calculation.component';
import { StudentPersonalReportComponent } from './student-personal-report/student-personal-report.component';
import { SelectReportComponent } from './select-report/select-report.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CreateStudentReportComponent } from './create-student-report/create-student-report.component';
import { StudentResultCalculationComponent } from './student-result-calculation/student-result-calculation.component';
import { StudentCompleteReportComponent } from './student-complete-report/student-complete-report.component';

const routes: Routes = [
  {
    path:"",
    component:AboutUsComponent
  },
  {
    path: 'dashboard',
    component: HomePageComponent
  },
  {
    path: 'create-report',
    component: CreateReportComponent
  },
  {
    path: 'marks-list',
    component: MarksListComponent
  },
  {
    path: 'result-calculation',
    component: ResultCalculationComponent
  },
  {
    path : "student-personal-report",
    component: StudentPersonalReportComponent
  },
  {
    path:"select-report",
    component:SelectReportComponent
  },
  {
    path:"create-student-report",
    component:CreateStudentReportComponent
  },
  {
    path:"student-result-calculation",
    component:StudentResultCalculationComponent
  },
  {
    path:"student-complete-report",
    component:StudentCompleteReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
