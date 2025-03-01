import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-res-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './res-button.component.html',
  styleUrl: './res-button.component.css'
})
export class ResButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() iconLeft: string | null = null;
  @Input() iconRight: string | null = null;
  @Input() loading = false;
  @Input() outline = false;
  
  @Output() buttonClick = new EventEmitter<MouseEvent>();
  
  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
  
  get buttonClasses(): string {
    const classes = ['res-button', `res-button-${this.variant}`];
    
    if (this.size !== 'md') {
      classes.push(`res-button-${this.size}`);
    }
    
    if (this.fullWidth) {
      classes.push('res-button-full-width');
    }
    
    if (this.disabled) {
      classes.push('res-button-disabled');
    }
    
    if (this.loading) {
      classes.push('res-button-loading');
    }
    
    if (this.outline) {
      classes.push('res-button-outline');
    }
    
    return classes.join(' ');
  }
}