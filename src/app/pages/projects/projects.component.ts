import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  projects = [
    { id: 'vivienda-unifamiliar', image: 'assets/images/vivienda-unifamiliar.jpg', title: 'Vivienda Unifamiliar' },
    { id: 'residencial-colectivo', image: 'assets/images/residencial-colectivo.jpg', title: 'Residencial Colectivo' },
    { id: 'interiorismo', image: 'assets/images/interiorismo.jpg', title: 'Interiorismo' },
    { id: 'obras-singulares', image: 'assets/images/obras-singulares.png', title: 'Obras Singulares' },
  ];

  constructor(private router: Router) {}

  navigateToProject(id: string) {
    this.router.navigate(['/projects', id]);
  }
}