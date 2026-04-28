import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styles: []
})
export class BuyerProfileComponent implements OnInit {
  profileData$: Observable<any> | null = null;
  
  constructor(
    public authService: FirebaseAuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.profileData$ = this.authService.user$;
  }
}
