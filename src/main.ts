import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { SorteoComponent } from './app/sorteo/sorteo.component';

bootstrapApplication(SorteoComponent, {
  providers: [
    provideHttpClient()
  ]
});