import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
// import { AuthInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // {
    //   provide:HTTP_INTERCEPTORS,
    //   useClass:AuthInterceptor,
    //   multi:true
    // },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

  ]
};
