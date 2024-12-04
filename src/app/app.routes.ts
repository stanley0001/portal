import { Routes } from '@angular/router';

import { KycComponent } from './kyc/kyc.component'; // Adjust the path as necessary
import { KycResultComponent } from './kyc-result/kyc-result.component';
import { AuthComponent } from './auth/auth.component';
import { ClientComponent } from './client/client.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'client',
    component: ClientComponent,
    canActivate: [AuthGuard], 
    // data: { permission: 'ADMIN' },
  children: [
  { path: 'kyc', component: KycComponent },
  { path: 'kyc-result', component: KycResultComponent },
  { path: '', redirectTo: '/kyc', pathMatch: 'full' },
  { path: '**', redirectTo: '/kyc' }
  ]
  },
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth' }

];
