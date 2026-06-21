import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap, map, catchError } from 'rxjs';

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styles: []
})
export class BuyerProfileComponent implements OnInit {
  profileData$: Observable<any> | null = null;
  orders$: Observable<any> | null = null;
  activeTab: 'details' | 'orders' = 'details';
  
  constructor(
    public authService: FirebaseAuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.profileData$ = this.authService.user$;
    
    // Fetch user orders sorted by date descending
    this.orders$ = this.authService.user$.pipe(
      switchMap(user => {
        if (!user || !user.email) {
          return of([]);
        }
        return this.firestore.collection('ecommerce_system/metadata/orders', ref => 
          ref.where('email', '==', user.email).orderBy('createdAt', 'desc')
        ).valueChanges({ idField: 'id' }).pipe(
          catchError(err => {
            console.error('Error fetching orders from Firestore:', err);
            // Fallback: If no index is defined yet for orderBy+where, fetch and sort in memory
            return this.firestore.collection('ecommerce_system/metadata/orders', ref => 
              ref.where('email', '==', user.email)
            ).valueChanges({ idField: 'id' }).pipe(
              map((orders: any[]) => {
                return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              })
            );
          })
        );
      })
    );
  }

  switchTab(tab: 'details' | 'orders'): void {
    this.activeTab = tab;
  }
}
