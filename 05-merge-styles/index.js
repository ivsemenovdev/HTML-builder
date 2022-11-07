const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const sourcePath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist', 'bundle.css');

let data = '';

fsPromises.writeFile(
  destinationPath, data, {
    encoding: 'utf8',
    flag: 'w',
    mode: 0o666
  })
  .then(function () {
    fs.readdir(sourcePath,
      {withFileTypes: true},
      (err, files) => {
        if (err)
          console.log(err);
        else {

          files.forEach(file => {
            const extension = path.extname(file.name);
            if (extension === '.css') {
              fsPromises.readFile(path.join(sourcePath, file.name))
                .then(value => {
                  fsPromises.appendFile(destinationPath, value)
                    .then(function () {
                      console.log(`Styles from ${file.name} added to bundle.css`);
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                  fsPromises.appendFile(destinationPath, '\n')
                    .then(function () {
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                });
            }
          });

        }
      });
    console.log('File written successfully\n');
  })
  .catch(function (error) {
    console.log(error);
  });

