import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { MarksListComponent } from './marks-list/marks-list.component';
import { ResultCalculationComponent } from './result-calculation/result-calculation.component';

const routes: Routes = [
  {
    path: '',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
