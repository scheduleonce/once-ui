// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const fs = require('fs');
// Resolve CHROME_BIN in this order:
// 1. honor existing CHROME_BIN env var
// 2. use Puppeteer's downloaded Chromium if present
// 3. fall back to common system chrome/chromium binaries
if (!process.env.CHROME_BIN) {
  try {
    const puppeteer = require('puppeteer');
    const pPath =
      typeof puppeteer.executablePath === 'function'
        ? puppeteer.executablePath()
        : puppeteer.executablePath;
    if (pPath && fs.existsSync(pPath)) {
      process.env.CHROME_BIN = pPath;
    }
  } catch (e) {
    // ignore if puppeteer isn't installed or fails
  }
  process.env.CHROME_BIN =
    process.env.CHROME_BIN ||
    '/usr/bin/chromium-browser' ||
    '/usr/bin/chromium' ||
    '/usr/bin/google-chrome-stable' ||
    'google-chrome-stable';
}
console.log('Resolved CHROME_BIN =', process.env.CHROME_BIN);
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-junit-reporter'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    junitReporter: {
      outputDir: require('path').join(__dirname, '../reports'),
      outputFile: 'ui-test-results.xml',
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['dots', 'junit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
        // Explicitly set the binary to the resolved CHROME_BIN so Karma
        // does not rely on Puppeteer's cache path or PATH lookup.
        binary: process.env.CHROME_BIN,
      },
    },
    singleRun: true,
    restartOnFileChange: true,
  });
};
