import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { SubjectsComponent } from './subjects/subjects.component';

export const angularPagesRoutes: Route[] = [
  {
    path: 'subjects',
    component: SubjectsComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(angularPagesRoutes)],
  declarations: [
    SubjectsComponent
  ],
})
export class AngularPagesModule {}
