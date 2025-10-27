import { createReducer, on, createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Order } from '../../models/user.model';
import * as OrdersActions from './orders.actions';

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>();

export const initialState: OrdersState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const ordersReducer = createReducer(
  initialState,
  on(OrdersActions.loadOrders, (state) => ({ ...state, loading: true, error: null })),
  on(OrdersActions.loadOrdersSuccess, (state, { orders }) =>
    adapter.setAll(orders, { ...state, loading: false, error: null })
  ),
  on(OrdersActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(OrdersActions.loadUserOrders, (state) => ({ ...state, loading: true, error: null })),
  on(OrdersActions.loadUserOrdersSuccess, (state, { orders }) =>
    adapter.setAll(orders, { ...state, loading: false, error: null })
  ),
  on(OrdersActions.loadUserOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

export const selectAllOrders = (state: OrdersState) => adapter.getSelectors().selectAll(state);

export const { selectIds, selectEntities, selectTotal } = adapter.getSelectors();
