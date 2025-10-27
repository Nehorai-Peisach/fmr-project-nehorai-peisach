import { UsersState } from './users/users.reducer';
import { OrdersState } from './orders/orders.reducer';

export interface AppState {
  users: UsersState;
  orders: OrdersState;
}
