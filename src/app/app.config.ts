import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandlerService } from './core/services/error-handler.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(
      // Add any HTTP interceptors here if needed
      // withInterceptors([authInterceptor])
    ),
    { 
      provide: ErrorHandler, 
      useClass: GlobalErrorHandlerService 
    }
  ]
};