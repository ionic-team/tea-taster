import { Action, createReducer, on } from '@ngrx/store';
import * as Actions from '@app/store/actions';
import { Session } from '@app/models';

export interface AuthState {
  session?: Session;
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
  on(Actions.loginSuccess, (state, { session }) => ({
    ...state,
    session,
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
    delete newState.session;
    return newState;
  }),
  on(Actions.logoutFailure, (state, { errorMessage }) => ({
    ...state,
    loading: false,
    errorMessage,
  })),
  on(Actions.unauthError, state => {
    const newState = { ...state };
    delete newState.session;
    return newState;
  }),
  on(Actions.sessionLocked, state => {
    const newState = { ...state };
    delete newState.session;
    return newState;
  }),
  on(Actions.sessionRestored, (state, { session }) => ({
    ...state,
    session,
  })),
);
