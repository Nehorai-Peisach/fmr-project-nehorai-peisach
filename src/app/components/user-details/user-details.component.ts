import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserDetails } from '../../models/user.model';
import {
  selectUserDetails,
  selectUserDetailsLoading,
  selectUserDetailsError,
  selectSelectedUserId,
} from '../../store/users/users.reducer';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  selectedUserId = signal<number | null>(null);
  userDetails = signal<UserDetails | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<any>(null);
  lastLoadTime = signal<string>('');

  private subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const selectedUserIdSub = this.store.select(selectSelectedUserId).subscribe((userId) => {
      this.selectedUserId.set(userId);
    });

    const userDetailsSub = this.store.select(selectUserDetails).subscribe((details) => {
      this.userDetails.set(details);
      if (details) {
        this.lastLoadTime.set(new Date().toLocaleTimeString('he-IL'));
      }
    });

    const loadingSub = this.store.select(selectUserDetailsLoading).subscribe((loading) => {
      this.isLoading.set(loading);
    });

    const errorSub = this.store.select(selectUserDetailsError).subscribe((error) => {
      this.error.set(error);
    });

    this.subscriptions.push(selectedUserIdSub, userDetailsSub, loadingSub, errorSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('he-IL');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('he-IL');
  }

  getUserInitial(): string {
    const userDetails = this.userDetails();
    return userDetails ? userDetails.name.charAt(0).toUpperCase() : '?';
  }
}
