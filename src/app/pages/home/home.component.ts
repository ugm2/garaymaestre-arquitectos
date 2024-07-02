import { Component, OnInit } from '@angular/core';
import SwiperCore, { SwiperOptions, Navigation, Pagination } from 'swiper';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  galleryItems = [
    { image: 'assets/images/Foto-1-Viv-Unif-1080x530.jpg', title: 'Project 1' },
    { image: 'assets/images/Foto-2-Viv-Colect-1080x530.jpg', title: 'Project 2' },
    { image: 'assets/images/Foto-3-Otros-Int-1080x530.jpg', title: 'Project 3' },
  ];

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    loop: true
  };

  constructor() { }

  ngOnInit(): void {
    console.log('Home component loaded');
  }
}