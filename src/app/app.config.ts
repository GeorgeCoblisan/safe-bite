import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { Amplify } from 'aws-amplify';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { authInterceptor } from './shared/auth/interceptor/auth-interceptor';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: environment.cognito.userPoolWebClientId,
      userPoolId: environment.cognito.userPoolId,
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(
      IonicModule.forRoot({ innerHTMLTemplatesEnabled: true })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
