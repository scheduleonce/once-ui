const fs = require('fs');

let chromePath;
try {
  // 1. Try finding Puppeteer's executable (works locally)
  chromePath = require('puppeteer').executablePath();
} catch (e) {
  // 2. Fallback to standard Ubuntu path if puppeteer resolution throws an error
  chromePath = '/usr/bin/chromium-browser';
}

// 3. CRITICAL: If the resolved path doesn't physically exist on disk (like in your CI failure)
// or if we are explicitly running inside GitHub Actions, force the system binary path.
if (!fs.existsSync(chromePath) || process.env.GITHUB_ACTIONS === 'true') {
  // If chromium-browser isn't found, try alternative common linux paths
  if (fs.existsSync('/usr/bin/chromium-browser')) {
    chromePath = '/usr/bin/chromium-browser';
  } else if (fs.existsSync('/usr/bin/chromium')) {
    chromePath = '/usr/bin/chromium';
  } else {
    chromePath = '/usr/bin/google-chrome-stable';
  }
}

process.env.CHROME_BIN = chromePath;
console.log('🚀 Karma is booting Chrome from:', process.env.CHROME_BIN);
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
      },
    },
    singleRun: true,
    restartOnFileChange: true,
  });
};
