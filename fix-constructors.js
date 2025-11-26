const fs = require('fs');
const path = require('path');

// Function to fix the malformed constructors
function fixMalformedConstructor(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the malformed constructor pattern: constructor()constructor()
    content = content.replace(
      /constructor\(\)constructor\(\)/g,
      'constructor()'
    );

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
  fixMalformedConstructor(file);
});

console.log('Done!');
