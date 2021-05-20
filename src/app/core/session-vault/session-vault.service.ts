import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AuthMode,
  IonicIdentityVaultUser,
  IonicNativeAuthPlugin,
  LockEvent,
  VaultErrorCodes,
} from '@ionic-enterprise/identity-vault';
import { ModalController, Platform } from '@ionic/angular';

import { Session } from '@app/models';
import { sessionLocked, sessionRestored } from '@app/store/actions';
import { State } from '@app/store';
import { BrowserVaultPlugin } from '../browser-vault/browser-vault.plugin';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService extends IonicIdentityVaultUser<Session> {
  constructor(
    private browserVaultPlugin: BrowserVaultPlugin,
    private modalController: ModalController,
    platform: Platform,
    private store: Store<State>,
  ) {
    super(platform, {
      unlockOnAccess: true,
      hideScreenOnBackground: true,
      lockAfter: 5000,
      allowSystemPinFallback: true,
      shouldClearVaultAfterTooManyFailedAttempts: false,
    });
  }

  async restoreSession(): Promise<Session> {
    try {
      return await super.restoreSession();
    } catch (error) {
      if (error.code === VaultErrorCodes.VaultLocked) {
        const vault = await this.getVault();
        await vault.clear();
      } else {
        throw error;
      }
    }
  }

  async canUnlock(): Promise<boolean> {
    if (!(await this.hasStoredSession())) {
      return false;
    }
    const vault = await this.getVault();
    if (!(await vault.isLocked())) {
      return false;
    }

    const mode = await this.getAuthMode();
    return (
      mode === AuthMode.PasscodeOnly ||
      mode === AuthMode.BiometricAndPasscode ||
      (mode === AuthMode.BiometricOnly && (await this.isBiometricsAvailable()))
    );
  }

  onVaultLocked(event: LockEvent) {
    this.store.dispatch(sessionLocked());
  }

  onSessionRestored(session: Session) {
    this.store.dispatch(sessionRestored({ session }));
  }

  async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<string> {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PinDialogComponent,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest,
      },
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    return Promise.resolve(data || '');
  }

  getPlugin(): IonicNativeAuthPlugin {
    if ((this.platform as Platform).is('hybrid')) {
      return super.getPlugin();
    }
    return this.browserVaultPlugin;
  }
}
