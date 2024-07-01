import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  galleryItems = [
    { image: 'assets/images/Foto-1-Viv-Unif-1080x530.jpg', title: 'Project 1' },
    { image: 'assets/images/Foto-2-Viv-Colect-1080x530.jpg', title: 'Project 2' },
    { image: 'assets/images/Foto-3-Otros-Int-1080x530.jpg', title: 'Project 3' },
  ];
}