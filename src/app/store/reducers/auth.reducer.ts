import { Action, createReducer, on } from '@ngrx/store';
import * as Actions from '@app/store/actions';
import { User } from '@app/models';

export interface AuthState {
  user?: User;
  loading: boolean;
  errorMessage: string;
}

export const initialState: AuthState = {
  loading: false,
  errorMessage: '',
};

export const reducer = createReducer(
  initialState,
  on(Actions.login, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  })),
  on(Actions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(Actions.loginFailure, (state, { errorMessage }) => ({
    ...state,
    loading: false,
    errorMessage,
  })),
  on(Actions.logout, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  })),
  on(Actions.logoutSuccess, state => {
    const newState = { ...state, loading: false };
    delete newState.user;
    return newState;
  }),
  on(Actions.logoutFailure, (state, { errorMessage }) => ({
    ...state,
    loading: false,
    errorMessage,
  })),
  on(Actions.unauthError, state => {
    const newState = { ...state };
    delete newState.user;
    return newState;
  }),
  on(Actions.sessionLocked, state => {
    const newState = { ...state };
    delete newState.user;
    return newState;
  }),
  on(Actions.unlockSessionSuccess, (state, { user }) => ({
    ...state,
    user,
  })),
);
