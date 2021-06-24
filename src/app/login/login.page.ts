import { Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectAuthErrorMessage, State } from '@app/store';
import { login, unlockSession } from '@app/store/actions';
import { SessionVaultService } from '@app/core';
import { Platform } from '@ionic/angular';
import { VaultType } from '@ionic-enterprise/identity-vault';

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

  vaultType: VaultType;
  vaultTypes: Array<{ type: VaultType; label: string }> = [
    {
      type: 'CustomPasscode',
      label: 'Session PIN Unlock',
    },
    {
      type: 'SecureStorage',
      label: 'Never Lock Session',
    },
    {
      type: 'InMemory',
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
        this.vaultTypes = [
          {
            type: 'DeviceSecurity',
            label: 'Biometric Unlock',
          },
          ...this.vaultTypes,
        ];
      }
      this.vaultType = this.vaultTypes[0].type;
    } else {
      this.displayLockingOptions = false;
      this.canUnlock = false;
    }
  }

  signIn() {
    this.store.dispatch(login({ vaultType: this.vaultType }));
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
