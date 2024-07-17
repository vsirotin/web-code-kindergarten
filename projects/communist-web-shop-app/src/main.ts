import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './core/components/app/app.config';
import { AppComponent } from './core/components/app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
