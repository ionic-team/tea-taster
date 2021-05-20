import { ApplicationService } from './application.service';

export const createApplicationServiceMock = () =>
  jasmine.createSpyObj<ApplicationService>('AppicationService', [
    'registerForUpdates',
  ]);
