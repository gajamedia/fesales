import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // ✅ Tambah ini
import { routes } from './app.routes';
import { AuthInterceptor } from './commons/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // ✅ Pakai interceptor
    AuthInterceptor // ✅ Daftarkan interceptor ke DI container
  ]
};
