import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResButtonComponent } from './res-button/res-button.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

const components = [
    NavBarComponent,
    ResButtonComponent
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ...components
  ],
  exports: [
    CommonModule,
    RouterModule,
    ...components
  ]
})
export class SharedModule { }