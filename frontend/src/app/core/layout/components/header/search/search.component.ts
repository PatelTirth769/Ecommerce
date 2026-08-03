import { Component, ElementRef,Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent {
  @Input() search!:ElementRef;
  constructor(private router:Router){}
  onKey(event:KeyboardEvent,element:HTMLInputElement){
    if(event.keyCode===13){
      this.navigateWithSearch(element.value.toLowerCase().trim());
    }
  }
  
  onSearch(element:HTMLInputElement){
    this.navigateWithSearch(element.value.toLowerCase().trim());
  }

  private navigateWithSearch(query: string) {
    const currentUrl = this.router.url.split('?')[0];
    const targetRoute = (currentUrl === '/' || currentUrl === '/home') ? '/' : '/product-master';
    
    if (query) {
      this.router.navigate([targetRoute], { queryParams: { q: query } });
    } else {
      this.router.navigate([targetRoute]);
    }
  }
}
