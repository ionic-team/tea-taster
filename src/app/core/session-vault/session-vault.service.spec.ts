import { TestBed } from '@angular/core/testing';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import { sessionLocked } from '@app/store/actions';
import { ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
  createPlatformMock,
} from '@test/mocks';
import { BrowserVaultService } from '../browser-vault/browser-vault.service';
import { createBrowserVaultServiceMock } from '../browser-vault/browser-vault.service.mock';
import { SessionVaultService } from './session-vault.service';

describe('SessionVaultService', () => {
  let modal: HTMLIonModalElement;
  let service: SessionVaultService;

  beforeEach(() => {
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {
          provide: ModalController,
          useValue: createOverlayControllerMock('ModalController', modal),
        },
        {
          provide: BrowserVaultService,
          useFactory: createBrowserVaultServiceMock,
        },
        { provide: Platform, useFactory: createPlatformMock },
      ],
    });
    service = TestBed.inject(SessionVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('dispatches sessionLocked when the session is locked', () => {
    const store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
    service.onVaultLocked();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(sessionLocked());
  });

  describe('isLocked', () => {
    it('returns the value from the vault', async () => {
      const vault = TestBed.inject(BrowserVaultService);
      (vault.isLocked as any).and.returnValue(Promise.resolve(false));
      expect(await service.isLocked()).toEqual(false);
      (vault.isLocked as any).and.returnValue(Promise.resolve(true));
      expect(await service.isLocked()).toEqual(true);
    });
  });

  describe('onPasscodeRequest', () => {
    beforeEach(() => {
      (modal.onDidDismiss as any).and.returnValue(
        Promise.resolve({ role: 'cancel' }),
      );
    });

    [true, false].forEach(setPasscode => {
      it(`creates a PIN dialog, setting passcode: ${setPasscode}`, async () => {
        const modalController = TestBed.inject(ModalController);
        await service.onPasscodeRequest(setPasscode);
        expect(modalController.create).toHaveBeenCalledTimes(1);
        expect(modalController.create).toHaveBeenCalledWith({
          backdropDismiss: false,
          component: PinDialogComponent,
          componentProps: {
            setPasscodeMode: setPasscode,
          },
        });
      });
    });

    it('presents the modal', async () => {
      await service.onPasscodeRequest(false);
      expect(modal.present).toHaveBeenCalledTimes(1);
    });

    it('resolves to the PIN', async () => {
      (modal.onDidDismiss as any).and.returnValue(
        Promise.resolve({ data: '4203', role: 'OK' }),
      );
      expect(await service.onPasscodeRequest(true)).toEqual('4203');
    });

    it('resolves to an empty string if the PIN is undefined', async () => {
      expect(await service.onPasscodeRequest(true)).toEqual('');
    });
  });
});
