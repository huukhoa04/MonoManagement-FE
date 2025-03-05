import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { ResButtonComponent } from '../res-button/res-button.component';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, ResButtonComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  avatar = '';
  userDropdownOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    // Close mobile menu when route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMenuOpen = false;
      this.userDropdownOpen = false;
      this.checkAuthStatus();
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    
    // Subscribe to auth changes
    this.authService.authStateChanged.subscribe(() => {
      this.checkAuthStatus();
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  signup(): void {
    this.router.navigate(['/signup']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userService.me().subscribe(user => {
        this.userName = user.username;
        this.avatar = (environment.baseUrl + user.avatar?.formats['small'].url) || '';
        console.log('User:', user);
      });
    }
  }
}