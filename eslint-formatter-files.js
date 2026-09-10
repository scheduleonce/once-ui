/**
 * Custom ESLint formatter that lists every linted file with its status.
 *
 * Unlike the default `stylish` formatter (which only shows files that have
 * issues), this formatter prints each file that was linted along with its
 * error/warning counts, so you can see exactly what was checked.
 *
 * Usage: `ng lint ui --format ./eslint-formatter-files.js`
 */
'use strict';

module.exports = function (results) {
  const lines = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const result of results) {
    const { filePath, errorCount, warningCount, messages } = result;
    totalErrors += errorCount;
    totalWarnings += warningCount;

    const status =
      errorCount > 0 ? '✗' : warningCount > 0 ? '⚠' : '✓';
    lines.push(
      `${status} ${filePath} (${errorCount} error${errorCount === 1 ? '' : 's'}, ${warningCount} warning${warningCount === 1 ? '' : 's'})`
    );

    for (const msg of messages) {
      const severity = msg.severity === 2 ? 'error' : 'warning';
      lines.push(
        `    ${msg.line}:${msg.column}  ${severity}  ${msg.message}  ${msg.ruleId || ''}`
      );
    }
  }

  lines.push('');
  lines.push(
    `Linted ${results.length} file${results.length === 1 ? '' : 's'} — ${totalErrors} error${totalErrors === 1 ? '' : 's'}, ${totalWarnings} warning${totalWarnings === 1 ? '' : 's'}`
  );

  return lines.join('\n');
};