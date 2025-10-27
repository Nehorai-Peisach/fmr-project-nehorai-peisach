import { Component, signal, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Order } from '../../models/user.model';
import { OrderService } from '../../services/order.service';
import * as UsersActions from '../../store/users/users.actions';
import * as OrdersActions from '../../store/orders/orders.actions';
import {
  selectUsersState,
  selectAllUsers,
  selectSelectedUser,
  selectSelectedUserId,
  selectSelectedUserOrders,
  selectSelectedUserSummary,
  selectUserDetailsLoading,
} from '../../store/users/users.reducer';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal<boolean>(false);
  error = signal<any>(null);

  selectedUser = signal<User | null>(null);
  selectedUserId = signal<number | null>(null);
  selectedUserOrders = signal<Order[]>([]);
  userDetailsLoading = signal<boolean>(false);
  selectedUserSummary = signal<{
    userName: string | null;
    totalOrdersSum: number;
    ordersCount: number;
  }>({
    userName: null,
    totalOrdersSum: 0,
    ordersCount: 0,
  });

  newUser = signal<User>({ id: 0, name: '' });
  editingUser = signal<User | null>(null);
  isEditing = signal<boolean>(false);
  newOrderAmount: number = 0;

  constructor(private store: Store<AppState>, private orderService: OrderService) {}

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
    this.store.dispatch(OrdersActions.loadOrders());

    this.store.select(selectUsersState).subscribe((usersState) => {
      this.users.set(selectAllUsers(usersState));
      this.loading.set(usersState.loading);
      this.error.set(usersState.error);
    });

    this.store.select(selectSelectedUserId).subscribe((userId) => {
      this.selectedUserId.set(userId);
    });

    this.store.select(selectSelectedUser).subscribe((user) => {
      this.selectedUser.set(user);
    });

    this.store.select(selectSelectedUserOrders).subscribe((orders) => {
      this.selectedUserOrders.set(orders);
    });

    this.store.select(selectSelectedUserSummary).subscribe((summary) => {
      this.selectedUserSummary.set(summary);
    });

    this.store.select(selectUserDetailsLoading).subscribe((loading) => {
      this.userDetailsLoading.set(loading);
    });
  }

  saveUser() {
    const user = this.isEditing() ? this.editingUser()! : this.newUser();

    if (!user.name.trim()) {
      alert('שם המשתמש לא יכול להיות רק');
      return;
    }

    if (!this.isEditing() && user.id <= 0) {
      const maxId = Math.max(...this.users().map((u) => u.id), 0);
      user.id = maxId + 1;
    }

    this.store.dispatch(UsersActions.saveUser({ user: { ...user } }));
    this.resetForm();
  }

  editUser(user: User) {
    this.editingUser.set({ ...user });
    this.isEditing.set(true);
  }

  deleteUser(userId: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
      this.store.dispatch(UsersActions.deleteUser({ userId }));
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.newUser.set({ id: 0, name: '' });
    this.editingUser.set(null);
    this.isEditing.set(false);
  }

  clearError() {
    this.store.dispatch(UsersActions.clearError());
  }

  selectUser(userId: number) {
    this.store.dispatch(UsersActions.selectUser({ userId }));
  }

  clearUserSelection() {
    this.store.dispatch(UsersActions.clearUserSelection());
  }

  addOrder() {
    const selectedUser = this.selectedUser();
    if (!selectedUser) {
      alert('לא נבחר משתמש');
      return;
    }

    if (!this.newOrderAmount || this.newOrderAmount <= 0) {
      alert('נא להזין סכום תקין');
      return;
    }

    this.orderService.addOrder(selectedUser.id, this.newOrderAmount).subscribe({
      next: (newOrder) => {
        console.log('Order added successfully:', newOrder);
        alert(
          `הזמנה נוספה בהצלחה! מספר הזמנה: ${newOrder.id}, סכום: ₪${newOrder.total.toFixed(2)}`
        );

        this.newOrderAmount = 0;

        this.store.dispatch(OrdersActions.loadOrders());
      },
      error: (error) => {
        console.error('Error adding order:', error);
        alert('שגיאה בהוספת ההזמנה. אנא נסה שנית.');
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'ממתין',
      processing: 'בעיבוד',
      shipped: 'נשלח',
      delivered: 'נמסר',
      cancelled: 'בוטל',
    };
    return statusMap[status] || status;
  }
}
