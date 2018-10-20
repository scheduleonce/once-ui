import { OnceDialogModule } from './once-dialog.module';

describe('OnceDialogModule', () => {
  let onceDialogModule: OnceDialogModule;

  beforeEach(() => {
    onceDialogModule = new OnceDialogModule();
  });

  it('should create an instance', () => {
    expect(OnceDialogModule).toBeTruthy();
  });
});
