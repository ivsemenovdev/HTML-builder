const fs = require('fs');
const path = require('path');

const secretPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretPath,
  { withFileTypes: true },
  (err, files) => {
    console.log('Current directory files:');
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (!file.isDirectory()) {
          const extension = path.extname(file.name);
          const fileName = path.basename(file.name,extension);
          const fileSize = fs.statSync(path.join(secretPath, file.name)).size;
          console.log(`${fileName} - ${extension.slice(1)} - ${(fileSize/1024).toFixed(2)}kb`);
        }
      });
    }
  });

//example - txt - 128.369kb