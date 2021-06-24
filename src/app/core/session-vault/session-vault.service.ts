import { Injectable } from '@angular/core';
import { State } from '@app/store';
import { Store } from '@ngrx/store';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import { ModalController, Platform } from '@ionic/angular';
import { sessionLocked } from '@app/store/actions';
import {
  Device,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private vault: Vault;
  private config: IdentityVaultConfig;

  constructor(
    private store: Store<State>,
    private modalController: ModalController,
    platform: Platform,
  ) {
    this.config = {
      key: 'com.kensodemann.teataster',
      deviceSecurityType: 'Both',
      type: 'CustomPasscode',
      lockAfterBackgrounded: 5000,
      shouldClearVaultAfterTooManyFailedAttempts: false,
    };

    const newVault = new Vault(this.config);

    newVault.onUnlock(() => {
      console.log('@VAULT UNLOCKED!');
    });

    newVault.onLock(() => {
      console.log('@VAULT LOCKED!');
      this.store.dispatch(sessionLocked());
    });

    newVault.onError(err => {
      console.log('@VAULT ERROR: ', err.message);
    });

    newVault.onPasscodeRequested(async isPasscodeSetRequest => {
      const dlg = await this.modalController.create({
        backdropDismiss: false,
        component: PinDialogComponent,
        componentProps: {
          setPasscodeMode: isPasscodeSetRequest,
        },
      });
      dlg.present();
      const { data } = await dlg.onDidDismiss();
      await this.vault.setCustomPasscode(data);
      return Promise.resolve();
    });

    this.vault = newVault;

    console.log('Vault initialized');
  }

  async canUnlock(): Promise<boolean> {
    if (!(await this.vault.doesVaultExist())) {
      console.log('@VAULT CANNOT BE UNLOCKED - does not exist!');
      return false;
    }

    if (!(await this.vault.isLocked())) {
      console.log('@VAULT CANNOT BE UNLOCKED - is not locked!');
      return false;
    }

    console.log('@VAULT CAN BE UNLOCKED!');

    return true;
  }

  async isLocked(): Promise<boolean> {
    return this.vault.isLocked();
  }

  async logout() {
    return this.vault.clear();
  }

  async unlock() {
    return this.vault.unlock();
  }

  async isBiometricsAvailable(): Promise<boolean> {
    return Device.isBiometricsEnabled();
  }

  async setVaultType(type: VaultType) {
    const newConfig = { ...this.config, type };
    return this.vault.updateConfig(newConfig);
  }

  getVault(): Vault {
    return this.vault;
  }
}
