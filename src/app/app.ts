import { Component, signal } from '@angular/core';
import { UsersComponent } from './components/users/users.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

@Component({
  selector: 'app-root',
  imports: [UsersComponent, UserOrdersComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('fmr-project-nehorai-peisach');
}
