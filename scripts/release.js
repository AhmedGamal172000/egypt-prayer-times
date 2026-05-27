const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../src/manifest.json');
const pkgPath = path.join(__dirname, '../package.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const tag = process.argv[2] || pkg.version;
manifest.version = tag.replace(/^v/, '');
pkg.version = tag.replace(/^v/, '');

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Version bumped to ${pkg.version}`);
