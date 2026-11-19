import { ComponentFixture } from '@angular/core/testing';

const originalDetectChanges = ComponentFixture.prototype.detectChanges;
ComponentFixture.prototype.detectChanges = function (checkNoChanges?: boolean) {
  return originalDetectChanges.call(this, checkNoChanges ?? false);
};
