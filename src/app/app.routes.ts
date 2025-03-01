import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ErrorComponent } from './features/error/error.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        data: {
            title: 'Home'
        }
    },
    {
        path: 'error',
        component: ErrorComponent,
        title: 'Error - MonoManagement'
    },
    {
        path: 'playground',
        loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent),
        title: 'Component Playground - MonoManagement'
    },
    { 
        path: '**', 
        redirectTo: '/error?code=404&message=Page%20Not%20Found&details=The%20page%20you%20are%20looking%20for%20does%20not%20exist.',
        pathMatch: 'full'
    }
];
