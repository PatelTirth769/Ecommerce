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
    if(event.keyCode===13&&element.value!==''){
      this.router.navigate(['/product-master'],{ queryParams: { q: element.value.toLowerCase().trim() }});
    } else if (event.keyCode===13 && element.value === '') {
      this.router.navigate(['/product-master']);
    }
  }
  onSearch(element:HTMLInputElement){
    if (element.value) {
      this.router.navigate(['/product-master'], { queryParams: { q: element.value.toLowerCase().trim() }});
    } else {
      this.router.navigate(['/product-master']);
    }
  }
}
