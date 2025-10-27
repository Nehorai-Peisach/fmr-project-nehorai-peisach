import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/user.model';

export const loadOrders = createAction('[Orders] Load Orders');
export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[] }>()
);
export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: any }>()
);

export const loadUserOrders = createAction(
  '[Orders] Load User Orders',
  props<{ userId: number }>()
);
export const loadUserOrdersSuccess = createAction(
  '[Orders] Load User Orders Success',
  props<{ orders: Order[] }>()
);
export const loadUserOrdersFailure = createAction(
  '[Orders] Load User Orders Failure',
  props<{ error: any }>()
);
