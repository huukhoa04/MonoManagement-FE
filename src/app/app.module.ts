import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { SharedModule } from './shared/shared.module';

// Add other components as needed


// Add shared services or providers as needed
const providers: any = [];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  providers: [...providers]
})
export class AppModule { }