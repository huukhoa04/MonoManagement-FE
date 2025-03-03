import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    
    {
        path: 'login',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
                title: 'Login - MonoManagement'
            }
        ]
    },
    {
        path: 'signup',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/signup/signup.component').then(m => m.SignupComponent),
                title: 'Sign Up - MonoManagement'
            }
        ]
    },
    {
        path: 'error',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/error/error.component').then(m => m.ErrorComponent),
                title: 'Error - MonoManagement'
            }
        ]
    },
        
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
                data: {
                    title: 'Home'
                }
            },
            {
                path: 'playground',
                loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent),
                title: 'Component Playground - MonoManagement',
            },
        ]
    },
    { 
        path: '**', 
        redirectTo: '/error?code=404&message=Page%20Not%20Found&details=The%20page%20you%20are%20looking%20for%20does%20not%20exist.',
        pathMatch: 'full'
    }
];
