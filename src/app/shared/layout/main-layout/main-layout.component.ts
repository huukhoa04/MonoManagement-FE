import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  template: `
    <app-nav-bar></app-nav-bar>
    <main>
        <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
    }
  `]
})
export class MainLayoutComponent {}