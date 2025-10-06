const fs = require('fs');
const path = require('path');

// Function to remove the backwards compatibility constructor
function removeBackwardsCompatibilityConstructor(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the backwards compatibility constructor pattern
    const patterns = [
      /\/\*\* Inserted by Angular inject\(\) migration for backwards compatibility \*\/\s*constructor\(\.\.\.args: unknown\[\]\);\s*/g,
      /\/\*\* Inserted by Angular inject\(\) migration for backwards compatibility \*\/\s*constructor\(\.\.\.args: unknown\[\]\);\s*constructor\(\)/g,
    ];

    patterns.forEach((pattern) => {
      content = content.replace(pattern, 'constructor()');
    });

    // Write back the modified content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Get all TypeScript files in the ui/src directory
function getAllTsFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getAllTsFiles(fullPath));
    } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main execution
const uiSrcPath = path.join(__dirname, 'ui', 'src');
const tsFiles = getAllTsFiles(uiSrcPath);

console.log(`Processing ${tsFiles.length} TypeScript files...`);

tsFiles.forEach((file) => {
  removeBackwardsCompatibilityConstructor(file);
});

console.log('Done!');
