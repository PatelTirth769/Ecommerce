import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-seller-screen',
  templateUrl: './seller-screen.component.html',
  styleUrls: ['./seller-screen.component.css']
})
export class SellerScreenComponent implements OnInit, OnDestroy {
  heroSlides = [
    'assets/images/seller1.png',
    'assets/images/seller2.png',
    'assets/images/seller3.png',
    'assets/images/seller4.png',
    'assets/images/seller19.png'
  ];

  currentSlide = 0;
  private timerId: any;

  ngOnInit(): void {
    this.timerId = setInterval(() => this.nextSlide(), 4000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
