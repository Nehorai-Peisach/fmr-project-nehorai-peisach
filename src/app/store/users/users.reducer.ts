import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User, UserDetails } from '../../models/user.model';
import * as UsersActions from './users.actions';
import { AppState } from '../app.state';
import { selectOrdersState, selectAllOrders } from '../orders/orders.reducer';

export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: any;
  selectedUserId: number | null;
  userDetails: UserDetails | null;
  userDetailsLoading: boolean;
  userDetailsError: any;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UsersState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedUserId: null,
  userDetails: null,
  userDetailsLoading: false,
  userDetailsError: null,
});

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    adapter.setAll(users, { ...state, loading: false, error: null })
  ),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.saveUser, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.saveUserSuccess, (state, { user }) => {
    const existingUser = state.entities[user.id];
    if (existingUser) {
      return adapter.updateOne(
        { id: user.id, changes: user },
        { ...state, loading: false, error: null }
      );
    } else {
      return adapter.addOne(user, { ...state, loading: false, error: null });
    }
  }),
  on(UsersActions.saveUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.deleteUser, (state) => ({ ...state, loading: true, error: null })),
  on(UsersActions.deleteUserSuccess, (state, { userId }) =>
    adapter.removeOne(userId, { ...state, loading: false, error: null })
  ),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.clearError, (state) => ({ ...state, error: null })),

  on(UsersActions.selectUser, (state, { userId }) => ({
    ...state,
    selectedUserId: userId,
    userDetails: null,
    userDetailsError: null,
  })),
  on(UsersActions.clearUserSelection, (state) => ({
    ...state,
    selectedUserId: null,
    userDetails: null,
    userDetailsLoading: false,
    userDetailsError: null,
  })),

  on(UsersActions.loadUserDetails, (state) => ({
    ...state,
    userDetailsLoading: true,
    userDetailsError: null,
  })),
  on(UsersActions.loadUserDetailsSuccess, (state, { userDetails }) => ({
    ...state,
    userDetails,
    userDetailsLoading: false,
    userDetailsError: null,
  })),
  on(UsersActions.loadUserDetailsFailure, (state, { error }) => ({
    ...state,
    userDetails: null,
    userDetailsLoading: false,
    userDetailsError: error,
  })),
  on(UsersActions.cancelUserDetailsLoad, (state) => ({
    ...state,
    userDetailsLoading: false,
    userDetailsError: null,
  }))
);

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = (state: UsersState) => adapter.getSelectors().selectAll(state);

export const { selectIds, selectEntities, selectTotal } = adapter.getSelectors();

export const selectSelectedUserId = createSelector(
  selectUsersState,
  (state: UsersState) => state.selectedUserId
);

export const selectUserDetails = createSelector(
  selectUsersState,
  (state: UsersState) => state.userDetails
);

export const selectUserDetailsLoading = createSelector(
  selectUsersState,
  (state: UsersState) => state.userDetailsLoading
);

export const selectUserDetailsError = createSelector(
  selectUsersState,
  (state: UsersState) => state.userDetailsError
);

export const selectSelectedUser = createSelector(
  selectUsersState,
  selectSelectedUserId,
  (usersState: UsersState, selectedUserId: number | null) => {
    if (!selectedUserId) return null;
    return usersState.entities[selectedUserId] || null;
  }
);

export const selectSelectedUserOrders = createSelector(
  selectSelectedUserId,
  (state: AppState) => selectOrdersState(state),
  (selectedUserId: number | null, ordersState) => {
    if (!selectedUserId) return [];
    const allOrders = selectAllOrders(ordersState);
    return allOrders.filter((order) => order.userId === selectedUserId);
  }
);

export const selectSelectedUserSummary = createSelector(
  selectSelectedUser,
  selectSelectedUserOrders,
  (selectedUser, userOrders) => {
    if (!selectedUser) {
      return {
        userName: null,
        totalOrdersSum: 0,
        ordersCount: 0,
      };
    }

    const totalSum = userOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      userName: selectedUser.name,
      totalOrdersSum: totalSum,
      ordersCount: userOrders.length,
    };
  }
);
