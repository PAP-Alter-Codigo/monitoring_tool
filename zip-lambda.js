const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream('tool-lambda.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

// List all files and folders you want to include
const filesToInclude = [
  'controller/',
  'middlewares/',
  'models/',
  'routes/',
  'utils/',
  'config.js',
  'server.js',
  'handler.js',
  'vista.js',
  'swagger.config.json',
  'package.json',
  'node_modules/'
];

output.on('close', () => {
  console.log(`tool-lambda.zip created (${archive.pointer()} total bytes)`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);

filesToInclude.forEach(item => {
  if (fs.existsSync(item)) {
    const stats = fs.statSync(item);
    if (stats.isDirectory()) {
      archive.directory(item, item);
    } else {
      archive.file(item, { name: item });
    }
  }
});

archive.finalize();