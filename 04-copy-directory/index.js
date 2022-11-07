const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const sourcePath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

fsPromises.mkdir(destinationPath).then(function () {
  console.log('Directory created successfully');
}).catch(function () {
  console.log('Directory already exist, all files was overwritten');
});

fs.readdir(sourcePath,
  {withFileTypes: true},
  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {

        fsPromises.copyFile(path.join(sourcePath, file.name), path.join(destinationPath, file.name))
          .then(function () {
            console.log(`File ${file.name} copied`);
          })
          .catch(function (error) {
            console.log(error);
          });

      });
    }
  });
