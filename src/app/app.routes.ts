import { Routes } from '@angular/router';
import { StartPageComponent } from './features/start-page/start-page.component';

// Sidebar layout + feature pages
import { LayoutComponent } from './layout/layout.component'; 
import { CompanyListComponent } from './features/company-list/company-list.component';
import { NewCompanyComponent } from './features/new-company/new-company.component';

export const routes: Routes = [
  // 👇 Default splash page (no sidebar)
  { path: '', component: StartPageComponent },

  // 👇 CRUD area (with sidebar)
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'company-list', component: CompanyListComponent },
      { path: 'new-company', component: NewCompanyComponent }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
