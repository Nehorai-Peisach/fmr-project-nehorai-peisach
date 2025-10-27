import { Injectable, inject } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, catchError, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UsersActions from './users.actions';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { selectSelectedUserId } from './users.reducer';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject(Store<AppState>);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() => {
        console.log('Loading users...');
        return this.userService.getUsers().pipe(
          map((users) => {
            console.log('Users loaded successfully:', users);
            return UsersActions.loadUsersSuccess({ users });
          }),
          catchError((error) => {
            console.error('Failed to load users:', error);
            return of(UsersActions.loadUsersFailure({ error }));
          })
        );
      })
    )
  );

  saveUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.saveUser),
      switchMap(({ user }) => {
        console.log('Saving user:', user);
        return this.userService.saveUser(user).pipe(
          map((savedUser: User) => {
            console.log('User saved successfully:', savedUser);
            return UsersActions.saveUserSuccess({ user: savedUser });
          }),
          catchError((error) => {
            console.error('Failed to save user:', error);
            return of(UsersActions.saveUserFailure({ error }));
          })
        );
      })
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ userId }) => {
        console.log('Deleting user with ID:', userId);
        return this.userService.deleteUser(userId).pipe(
          map(() => {
            console.log('User deleted successfully:', userId);
            return UsersActions.deleteUserSuccess({ userId });
          }),
          catchError((error) => {
            console.error('Failed to delete user:', error);
            return of(UsersActions.deleteUserFailure({ error }));
          })
        );
      })
    )
  );

  loadUserDetailsOnSelection$ = createEffect(() =>
    this.store.select(selectSelectedUserId).pipe(
      tap((userId) => console.log(`🔄 Store Change: selectedUserId changed to ${userId}`)),
      filter((userId) => userId !== null),
      tap((userId) => console.log(`🚀 Starting API call for user ${userId}`)),
      switchMap((userId) =>
        this.userService.getUserDetails(userId!).pipe(
          map((userDetails) => {
            console.log(`✅ API Success: User details loaded for ${userId}`, userDetails);
            return UsersActions.loadUserDetailsSuccess({ userDetails });
          }),
          catchError((error) => {
            console.error(`❌ API Error: Failed to load details for user ${userId}:`, error);
            return of(UsersActions.loadUserDetailsFailure({ error }));
          })
        )
      )
    )
  );

  loadUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUserDetails),
      switchMap(({ userId }) => {
        console.log(`📞 Manual API call: Loading details for user ${userId}`);
        return this.userService.getUserDetails(userId).pipe(
          map((userDetails) => {
            console.log(`✅ Manual API Success: User details loaded for ${userId}`);
            return UsersActions.loadUserDetailsSuccess({ userDetails });
          }),
          catchError((error) => {
            console.error(`❌ Manual API Error: Failed to load details for user ${userId}:`, error);
            return of(UsersActions.loadUserDetailsFailure({ error }));
          })
        );
      })
    )
  );
}
