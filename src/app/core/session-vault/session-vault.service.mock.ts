import { SessionVaultService } from './session-vault.service';

export const createSessionVaultServiceMock = () =>
  jasmine.createSpyObj<SessionVaultService>('SessionVaultService', {
    login: Promise.resolve(),
    logout: Promise.resolve(),
    isBiometricsAvailable: Promise.resolve(false),
    canUnlock: Promise.resolve(false),
    isLocked: Promise.resolve(false),
    unlock: Promise.resolve(),
    setAuthMode: undefined,
  });
