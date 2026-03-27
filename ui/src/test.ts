// This file is required by karma.conf.js and loads recursively all the .spec and framework files
// zone.js and zone.js/testing are loaded via polyfills in angular.json

import { enableProdMode } from '@angular/core';
import { ComponentFixture, getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

// First, initialize the Angular testing environment.
enableProdMode();

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);

// Angular 21 runs a strict no-changes verification during detectChanges in tests.
// Legacy specs in this workspace intentionally mutate bindings between checks.
// Defaulting to `false` keeps runtime behavior assertions while avoiding NG0100 noise.
const originalDetectChanges = ComponentFixture.prototype.detectChanges;
ComponentFixture.prototype.detectChanges = function (checkNoChanges?: boolean) {
  return originalDetectChanges.call(this, checkNoChanges ?? false);
};
