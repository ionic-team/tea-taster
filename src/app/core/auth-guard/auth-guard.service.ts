import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { NavController } from '@ionic/angular';

import { selectAuthToken, State } from '@app/store';
import { SessionVaultService } from '../session-vault/session-vault.service';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { Session } from '@app/models';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private navController: NavController,
    private store: Store<State>,
    private vault: SessionVaultService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(selectAuthToken),
      take(1),
      mergeMap(token => (token ? of(token) : this.tryRestoreSession())),
      map(value => !!value),
      tap(sessionExists => {
        if (!sessionExists) {
          this.navController.navigateRoot(['/', 'login']);
        }
      }),
    );
  }

  private async tryRestoreSession(): Promise<Session | undefined> {
    try {
      return await this.vault.restoreSession();
    } catch (err) {
      return undefined;
    }
  }
}
