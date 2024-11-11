import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule if not imported already
import { routes } from './app.routes';
import { KycComponent } from './kyc/kyc.component'; 
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    FormsModule,
    KycComponent,
    HttpClientModule, provideCharts(withDefaultRegisterables()), provideCharts(withDefaultRegisterables()) // Make sure HttpClientModule is provided
  ]
};
