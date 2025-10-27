import { Injectable, inject } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as OrdersActions from './orders.actions';
import { OrderService } from '../../services/order.service';

@Injectable()
export class OrdersEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders),
      switchMap(() => {
        console.log('Loading orders...');
        return this.orderService.getAllOrders().pipe(
          map((orders) => {
            console.log('Orders loaded successfully:', orders);
            return OrdersActions.loadOrdersSuccess({ orders });
          }),
          catchError((error) => {
            console.error('Failed to load orders:', error);
            return of(OrdersActions.loadOrdersFailure({ error }));
          })
        );
      })
    )
  );

  loadUserOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadUserOrders),
      switchMap(({ userId }) => {
        console.log('Loading orders for user:', userId);
        return this.orderService.getUserOrders(userId).pipe(
          map((orders) => {
            console.log('User orders loaded successfully:', orders);
            return OrdersActions.loadUserOrdersSuccess({ orders });
          }),
          catchError((error) => {
            console.error('Failed to load user orders:', error);
            return of(OrdersActions.loadUserOrdersFailure({ error }));
          })
        );
      })
    )
  );
}
