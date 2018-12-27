import { OuiIconModule } from './icon.module';

describe('IconModule', () => {
  let iconModule: OuiIconModule;

  beforeEach(() => {
    iconModule = new OuiIconModule();
  });

  it('should create an instance', () => {
    expect(iconModule).toBeTruthy();
  });
});
