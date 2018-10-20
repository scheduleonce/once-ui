import { OverlayPanelModule } from './overlay-panel.module';

describe('OverlayPanelModule', () => {
  let overlayPanelModule: OverlayPanelModule;

  beforeEach(() => {
    overlayPanelModule = new OverlayPanelModule();
  });

  it('should create an instance', () => {
    expect(overlayPanelModule).toBeTruthy();
  });
});
