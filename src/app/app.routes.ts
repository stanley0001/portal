import { Routes } from '@angular/router';

import { KycComponent } from './kyc/kyc.component'; // Adjust the path as necessary
import { KycResultComponent } from './kyc-result/kyc-result.component';

export const routes: Routes = [
  { path: 'kyc', component: KycComponent },
  { path: 'kyc-result', component: KycResultComponent },
  { path: '', redirectTo: '/kyc', pathMatch: 'full' },
  { path: '**', redirectTo: '/kyc' }
];
