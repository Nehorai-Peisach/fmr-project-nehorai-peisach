import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import * as UsersActions from '../../store/users/users.actions';
import * as OrdersActions from '../../store/orders/orders.actions';
import {
  selectSelectedUser,
  selectSelectedUserSummary,
  selectUsersState,
  selectAllUsers,
} from '../../store/users/users.reducer';
import { AppState } from '../../store/app.state';
import { UserNameComponent } from '../user-name/user-name.component';
import { UserOrdersSummaryComponent } from '../user-orders-summary/user-orders-summary.component';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, UserNameComponent, UserOrdersSummaryComponent, UserDetailsComponent],
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss'],
})
export class UserOrdersComponent implements OnInit, OnDestroy {
  selectedUser = signal<User | null>(null);
  selectedUserSummary = signal<{
    userName: string | null;
    totalOrdersSum: number;
    ordersCount: number;
  }>({
    userName: null,
    totalOrdersSum: 0,
    ordersCount: 0,
  });
  allUsers = signal<User[]>([]);

  private subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
    this.store.dispatch(OrdersActions.loadOrders());

    const selectedUserSub = this.store.select(selectSelectedUser).subscribe((user) => {
      this.selectedUser.set(user);
    });

    const summaryUserSub = this.store.select(selectSelectedUserSummary).subscribe((summary) => {
      this.selectedUserSummary.set(summary);
    });

    const allUsersSub = this.store.select(selectUsersState).subscribe((usersState) => {
      this.allUsers.set(selectAllUsers(usersState));
    });

    this.subscriptions.push(selectedUserSub, summaryUserSub, allUsersSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  selectUser(userId: number) {
    this.store.dispatch(UsersActions.selectUser({ userId }));
  }

  clearSelection() {
    this.store.dispatch(UsersActions.clearUserSelection());
  }
}
