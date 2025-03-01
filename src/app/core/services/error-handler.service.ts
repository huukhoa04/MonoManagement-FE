import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private router: Router,
    private zone: NgZone,
  ) {}

  handleError(error: Error | HttpErrorResponse): void {
    console.error('Error caught by Global Error Handler:', error);
    
    let errorCode = 500;
    let errorMessage = 'Internal Server Error';
    let errorDetails = 'Something went wrong. Please try again later.';

    if (error instanceof HttpErrorResponse) {
      errorCode = error.status;
      
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized';
          errorDetails = 'You need to log in to access this resource.';
          break;
        case 403:
          errorMessage = 'Forbidden';
          errorDetails = 'You don\'t have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Not Found';
          errorDetails = 'The requested resource could not be found.';
          break;
        case 0:
          errorCode = 0;
          errorMessage = 'Network Error';
          errorDetails = 'Could not connect to the server. Please check your connection.';
          break;
      }
    } else {
      // Handle client-side errors
      if (error.message.includes('Navigation cancelled')) {
        // This is a common Angular router error that we can safely ignore
        return;
      }
      
      errorMessage = 'Application Error';
      errorDetails = error.message || 'An unexpected error occurred.';
    }

    // Use NgZone to ensure Angular's change detection is triggered
    this.zone.run(() => {
      this.router.navigate(['/error'], { 
        queryParams: { 
          code: errorCode,
          message: errorMessage,
          details: errorDetails
        }
      });
    });
  }
}