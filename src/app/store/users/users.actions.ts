import { createAction, props } from '@ngrx/store';
import { User, UserDetails } from '../../models/user.model';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: any }>());

export const saveUser = createAction('[Users] Save User', props<{ user: User }>());
export const saveUserSuccess = createAction('[Users] Save User Success', props<{ user: User }>());
export const saveUserFailure = createAction('[Users] Save User Failure', props<{ error: any }>());

export const deleteUser = createAction('[Users] Delete User', props<{ userId: number }>());
export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ userId: number }>()
);
export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: any }>()
);

export const clearError = createAction('[Users] Clear Error');

export const selectUser = createAction('[Users] Select User', props<{ userId: number }>());
export const clearUserSelection = createAction('[Users] Clear User Selection');

export const loadUserDetails = createAction(
  '[Users] Load User Details',
  props<{ userId: number }>()
);
export const loadUserDetailsSuccess = createAction(
  '[Users] Load User Details Success',
  props<{ userDetails: UserDetails }>()
);
export const loadUserDetailsFailure = createAction(
  '[Users] Load User Details Failure',
  props<{ error: any }>()
);
export const cancelUserDetailsLoad = createAction('[Users] Cancel User Details Load');
