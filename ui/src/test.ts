// This file is required by karma.conf.js and loads recursively all the .spec and framework files
// zone.js and zone.js/testing are loaded via polyfills in angular.json

import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
