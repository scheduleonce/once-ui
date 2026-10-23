// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const { execFileSync } = require('child_process');

process.env.CHROME_BIN = execFileSync(
  process.execPath,
  [
    '-e',
    "require('puppeteer').executablePath().then((path) => process.stdout.write(path))",
  ],
  { encoding: 'utf8' }
).trim();

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
      require('karma-spec-reporter'),
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
    reporters: ['spec', 'junit'],
    specReporter: {
      maxLogLines: 5, // limit the number of lines logged per failing test
      suppressErrorSummary: false, // do not print error summary
      suppressFailed: false, // do not print result of failed tests
      suppressPassed: false, // do not print result of passed tests
      suppressSkipped: true, // do not print result of skipped tests
      showSpecTiming: true, // print the time elapsed for each test
      failFast: false, // test would finish with error when a first fail occurs
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: true,
    restartOnFileChange: true,
  });
};
