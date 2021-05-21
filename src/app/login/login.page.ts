import { Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectAuthErrorMessage, State } from '@app/store';
import { login, unlockSession } from '@app/store/actions';
import { SessionVaultService } from '@app/core';
import { Platform } from '@ionic/angular';
import { AuthMode } from '@ionic-enterprise/identity-vault';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  canUnlock = false;

  displayLockingOptions: boolean;
  authMode: AuthMode;
  authModes: Array<{ mode: AuthMode; label: string }> = [
    {
      mode: AuthMode.PasscodeOnly,
      label: 'Session PIN Unlock',
    },
    {
      mode: AuthMode.SecureStorage,
      label: 'Never Lock Session',
    },
    {
      mode: AuthMode.InMemoryOnly,
      label: 'Force Login',
    },
  ];

  errorMessage$: Observable<string>;

  constructor(
    private platform: Platform,
    private sessionVault: SessionVaultService,
    private store: Store<State>,
    private zone: NgZone,
  ) {}

  async ngOnInit(): Promise<void> {
    this.errorMessage$ = this.store.select(selectAuthErrorMessage);
    if (this.platform.is('hybrid')) {
      this.canUnlock = await this.sessionVault.canUnlock();
      this.displayLockingOptions = true;
      if (await this.sessionVault.isBiometricsAvailable()) {
        this.authModes = [
          {
            mode: AuthMode.BiometricOnly,
            label: 'Biometric Unlock',
          },
          ...this.authModes,
        ];
      }
      this.authMode = this.authModes[0].mode;
    } else {
      this.displayLockingOptions = false;
      this.canUnlock = false;
    }
  }

  signIn() {
    this.store.dispatch(login({ mode: this.authMode }));
  }

  redo() {
    this.zone.run(() => {
      this.canUnlock = false;
    });
  }

  unlock() {
    this.store.dispatch(unlockSession());
  }
}
