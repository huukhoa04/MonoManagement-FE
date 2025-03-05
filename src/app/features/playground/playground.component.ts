import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ResButtonComponent } from '../../shared/res-button/res-button.component';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, ResButtonComponent],
  template: `
    <div class="playground">
      <h1>Playground</h1>
      <app-res-button></app-res-button>
    </div>
  `,
  styles: [`
    .playground {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  `]
})
export class PlaygroundComponent {
  
}