import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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
    this.authService.user$.subscribe(user => {
      if (user?.uid) {
        // Fetch profile data from Firestore
        this.profileData$ = this.firestore
          .collection('ecommerce_system')
          .doc('metadata')
          .collection('buyers')
          .doc(user.uid)
          .valueChanges();
      }
    });
  }
}
