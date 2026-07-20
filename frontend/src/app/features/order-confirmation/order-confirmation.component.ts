import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { PaymentService } from 'src/app/core/services/payment.service';

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 20; // ~60s

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styles: []
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  razorpayOrderId!: string;
  status: any = null;
  loading = true;
  private pollSub?: Subscription;
  private attempts = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.razorpayOrderId = this.route.snapshot.paramMap.get('razorpayOrderId') || '';
    if (!this.razorpayOrderId) {
      this.router.navigate(['/']);
      return;
    }
    this.fetchStatus();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  private fetchStatus(): void {
    console.log('%c[confirmation] GET /api/payment/status/' + this.razorpayOrderId, 'color:#3c64a9;font-weight:bold');
    this.paymentService.getPaymentStatus(this.razorpayOrderId).subscribe({
      next: (data) => {
        console.log('%c[confirmation] status response', 'color:#3c64a9;font-weight:bold', data);
        this.status = data;
        this.loading = false;
        if (data?.status === 'erpnext_syncing') {
          console.log('%c[confirmation] still syncing - starting to poll every ' + POLL_INTERVAL_MS + 'ms', 'color:#b08800;font-weight:bold');
          this.startPolling();
        }
      },
      error: (err) => {
        console.error('[confirmation] Failed to fetch payment status', err);
        this.loading = false;
      }
    });
  }

  private startPolling(): void {
    this.pollSub = interval(POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => this.paymentService.getPaymentStatus(this.razorpayOrderId)),
        takeWhile((data) => {
          this.attempts++;
          console.log(`%c[confirmation] poll #${this.attempts} - status = "${data?.status}"`, 'color:#3c64a9;font-weight:bold', data);
          return data?.status === 'erpnext_syncing' && this.attempts < POLL_MAX_ATTEMPTS;
        }, true)
      )
      .subscribe((data) => {
        this.status = data;
        if (data?.status !== 'erpnext_syncing') {
          console.log('%c[confirmation] polling stopped - final status = "' + data?.status + '"', 'color:#22863a;font-weight:bold', data);
        }
      });
  }

  get invoiceUrl(): string {
    return this.paymentService.getInvoiceDownloadUrl(this.razorpayOrderId);
  }

  get paymentEntryUrl(): string {
    return this.paymentService.getPaymentEntryDownloadUrl(this.razorpayOrderId);
  }
}
