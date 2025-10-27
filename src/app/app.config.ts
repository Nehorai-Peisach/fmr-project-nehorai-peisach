import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { usersReducer } from './store/users/users.reducer';
import { ordersReducer } from './store/orders/orders.reducer';
import { UsersEffects } from './store/users/users.effects';
import { OrdersEffects } from './store/orders/orders.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideStore({
      users: usersReducer,
      orders: ordersReducer,
    }),
    provideEffects([UsersEffects, OrdersEffects]),
  ],
};
