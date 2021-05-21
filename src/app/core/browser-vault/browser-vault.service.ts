import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import {
  BiometricType,
  IdentityVault,
  PluginConfiguration,
  AuthMode,
  SupportedBiometricType,
} from '@ionic-enterprise/identity-vault';

@Injectable({
  providedIn: 'root',
})
export class BrowserVaultService implements IdentityVault {
  config = {
    authMode: AuthMode.SecureStorage,
    descriptor: {
      username: '',
      vaultId: '',
    },
    isBiometricsEnabled: false,
    isPasscodeEnabled: false,
    isPasscodeSetupNeeded: false,
    isSecureStorageModeEnabled: true,
    hideScreenOnBackground: false,
    lockAfter: 50000,
  };

  constructor() {}

  async unsubscribe(): Promise<void> {}

  async clear(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    await Storage.clear();
  }

  async lock(): Promise<void> {}

  async isLocked(): Promise<boolean> {
    return false;
  }

  async isInUse(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return !!(await Storage.get({ key: 'session' }));
  }

  async getConfig(): Promise<PluginConfiguration> {
    return this.config;
  }

  async remainingAttempts(): Promise<number> {
    return 5;
  }

  async getUsername(): Promise<string> {
    return 'MyUsername';
  }

  async storeToken(token: any): Promise<void> {}

  async getToken(): Promise<any> {
    return 'MyToken';
  }

  async storeValue(key: string, value: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    await Storage.set({ key, value: JSON.stringify(value) });
  }

  async getValue(key: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { value } = await Storage.get({ key });
    return JSON.parse(value);
  }

  async removeValue(key: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    await Storage.remove({ key });
  }

  async getKeys(): Promise<Array<string>> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { keys } = await Storage.keys();
    return keys;
  }

  async getBiometricType(): Promise<BiometricType> {
    return 'none';
  }

  async getAvailableHardware(): Promise<Array<SupportedBiometricType>> {
    return [];
  }

  async setBiometricsEnabled(isBiometricsEnabled: boolean): Promise<void> {}

  async isBiometricsEnabled(): Promise<boolean> {
    return false;
  }

  async isBiometricsAvailable(): Promise<boolean> {
    return false;
  }

  async isBiometricsSupported(): Promise<boolean> {
    return false;
  }

  async isLockedOutOfBiometrics(): Promise<boolean> {
    return false;
  }

  async isPasscodeSetupNeeded(): Promise<boolean> {
    return false;
  }

  async setPasscode(passcode?: string): Promise<void> {}

  async isPasscodeEnabled(): Promise<boolean> {
    return false;
  }

  async isSecureStorageModeEnabled(): Promise<boolean> {
    return true;
  }

  async setPasscodeEnabled(isPasscodeEnabled: boolean): Promise<void> {}

  async setSecureStorageModeEnabled(enabled: boolean): Promise<void> {}

  async unlock(usingPasscode?: boolean, passcode?: string): Promise<void> {}

  async setHideScreenOnBackground(enabled: boolean): Promise<void> {}
}
