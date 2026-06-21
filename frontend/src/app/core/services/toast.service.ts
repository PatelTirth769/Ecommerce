import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 5000) {
    this.toastSubject.next({ message, type, duration });
  }

  showSuccess(message: string, duration: number = 5000) {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000) {
    this.show(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 5000) {
    this.show(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 5000) {
    this.show(message, 'warning', duration);
  }
}
