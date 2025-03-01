import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  errorCode: number = 404;
  errorMessage: string = 'Page not found';
  errorDetails: string = 'The page you are looking for might have been removed or is temporarily unavailable.';
  
  constructor(private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.errorCode = +params['code'];
      }
      if (params['message']) {
        this.errorMessage = params['message'];
      }
      if (params['details']) {
        this.errorDetails = params['details'];
      }
    });
  }
  
  goToHome(): void {
    this.router.navigate(['/']);
  }
}