import { Injectable } from '@angular/core';
import {
  IdentityVault,
  PluginOptions,
  IonicNativeAuthPlugin,
} from '@ionic-enterprise/identity-vault';
import { BrowserVaultService } from './browser-vault.service';

@Injectable({ providedIn: 'root' })
export class BrowserVaultPlugin implements IonicNativeAuthPlugin {
  constructor(private browserVaultService: BrowserVaultService) {}

  getVault(config: PluginOptions): IdentityVault {
    config.onReady(this.browserVaultService);
    return this.browserVaultService;
  }
}
