import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { selectSelectedUser } from '../../store/users/users.reducer';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-user-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss'],
})
export class UserNameComponent implements OnInit, OnDestroy {
  selectedUser = signal<User | null>(null);
  lastUpdate = signal<string>('');

  private subscription?: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select(selectSelectedUser).subscribe((user) => {
      this.selectedUser.set(user);
      this.lastUpdate.set(new Date().toLocaleTimeString('he-IL'));
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
