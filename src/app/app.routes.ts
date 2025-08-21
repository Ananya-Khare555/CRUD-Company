import { Routes } from '@angular/router';
import { StartPageComponent } from './features/start-page/start-page.component';
import { LayoutComponent } from './layout/layout.component'; 
import { CompanyListComponent } from './features/company-list/company-list.component';
import { NewCompanyComponent } from './features/new-company/new-company.component';

export const routes: Routes = [
  
  { path: '', component: StartPageComponent },

  
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'company-list', component: CompanyListComponent },
      { path: 'new-company', component: NewCompanyComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
