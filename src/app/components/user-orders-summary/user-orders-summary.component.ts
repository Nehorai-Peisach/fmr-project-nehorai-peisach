import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { selectSelectedUserSummary } from '../../store/users/users.reducer';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-user-orders-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-orders-summary.component.html',
  styleUrls: ['./user-orders-summary.component.scss'],
})
export class UserOrdersSummaryComponent implements OnInit, OnDestroy {
  userSummary = signal({
    userName: '',
    ordersCount: 0,
    totalOrdersSum: 0,
  });

  private subscription?: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select(selectSelectedUserSummary).subscribe((summary) => {
      this.userSummary.set({
        userName: summary?.userName || '',
        ordersCount: summary?.ordersCount || 0,
        totalOrdersSum: summary?.totalOrdersSum || 0,
      });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getProgressPercentage(): number {
    const target = 1000;
    const current = this.userSummary().totalOrdersSum;
    return Math.min((current / target) * 100, 100);
  }
}
