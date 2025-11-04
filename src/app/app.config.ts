import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore())
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({}),
    ...firebaseProviders
  ]
};