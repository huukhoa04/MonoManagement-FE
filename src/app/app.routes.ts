import { Routes } from '@angular/router';

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
        loadComponent: () => import('./features/error/error.component').then(m => m.ErrorComponent),
        title: 'Error - MonoManagement'
    },
    {
        path: 'playground',
        loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent),
        title: 'Component Playground - MonoManagement'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        title: 'Login - MonoManagement'
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/signup/signup.component').then(m => m.SignupComponent),
        title: 'Sign Up - MonoManagement'
    },
    { 
        path: '**', 
        redirectTo: '/error?code=404&message=Page%20Not%20Found&details=The%20page%20you%20are%20looking%20for%20does%20not%20exist.',
        pathMatch: 'full'
    }
];
