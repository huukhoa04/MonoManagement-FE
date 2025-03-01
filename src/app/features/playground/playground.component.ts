import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ResButtonComponent } from '../../shared/res-button/res-button.component';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, ResButtonComponent],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css',
})
export class PlaygroundComponent {
  isLoading = false;

  someFunction() {
    console.log('Button clicked!');
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    
    // Auto reset after 2 seconds
    if (this.isLoading) {
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }
}