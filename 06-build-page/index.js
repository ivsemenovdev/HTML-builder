const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const destinationPath = path.join(__dirname, 'project-dist');
const assetsSourcePath = path.join(__dirname, 'assets');
const stylesSourcePath = path.join(__dirname, 'styles');
const assetsPath = path.join(destinationPath, 'assets');

console.log('Build start...');

// create project-dist folder
fsPromises.mkdir(destinationPath)
  .then(function () {
    console.log('./project-dist directory created successfully');
  })
  .catch(function (err) {
    console.log('./project-dist directory already exist');
  });

// // create assets folder
fsPromises.mkdir(assetsPath)
  .then(function () {
    console.log(' ./assets directory created successfully');
  })
  .catch(function (err) {
    console.log(' ./assets directory already exist');
  });

// create same folders from source assets in assets folder in project-dist folder
fsPromises.readdir(assetsSourcePath, {withFileTypes: true})
  .then(function (dirs) {

    dirs.forEach(dir => {
      if (dir.isDirectory()) {
        fsPromises.mkdir(path.join(assetsPath, dir.name))
          .then(function () {
            console.log(`   ./${dir.name} sub directory created successfully`);
          })
          .catch(function (err) {
            console.log(`   ./${dir.name} sub directory already exist`);
          });
      }

    });
  })
  .catch(function (err) {
    console.log(err);
  });

// copy files from source assets sub folders in assets folder in project-dist folder
fs.readdir(assetsSourcePath,
  {withFileTypes: true},
  (err, dirs) => {
    // console.log(dirs);
    if (err)
      console.log(err);
    else {

      dirs.forEach(dir => {
        fs.readdir(path.join(assetsSourcePath, dir.name),
          {withFileTypes: true},
          (err, files) => {
            // console.log(files);
            if (err)
              console.log(err);
            else {
              files.forEach(file => {
                console.log(`Copy file ./${dir.name}/${file.name} success`);
                fs.createReadStream(path.join(assetsSourcePath, dir.name, file.name))
                  .pipe(fs.createWriteStream(path.join(assetsPath, dir.name, file.name)));
              });
            }
          });
      });

    }
  });

// create index.html file
let header = '';
let articles = '';
let footer = '';

const headerPath = path.join(__dirname, 'components', 'header.html');
fsPromises.readFile(headerPath, 'utf-8')
  .then(function (data) {
    header = data;
  });

const articlesPath = path.join(__dirname, 'components', 'articles.html');
fsPromises.readFile(articlesPath, 'utf-8')
  .then(function (data) {
    articles = data;
  });

const footerPath = path.join(__dirname, 'components', 'footer.html');
fsPromises.readFile(footerPath, 'utf-8')
  .then(function (data) {
    footer = data;
  });

let result = '';

fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8')
  .then(function (data) {
    result = data.replace(/({{header}})/g, header);
    // console.log(result);
    fsPromises.writeFile(path.join(__dirname, 'template_2.html'), result, {
      encoding: 'utf8',
      flag: 'w',
      mode: 0o666
    })
      .then(function () {
        fsPromises.readFile(path.join(__dirname, 'template_2.html'), 'utf-8')
          .then(function (data) {
            result = data.replace(/({{articles}})/g, articles);
            // console.log(result);
            fsPromises.writeFile(path.join(__dirname, 'template_3.html'), result, {
              encoding: 'utf8',
              flag: 'w',
              mode: 0o666
            })
              .then(function () {
                fsPromises.readFile(path.join(__dirname, 'template_3.html'), 'utf-8')
                  .then(function (data) {
                    result = data.replace(/({{footer}})/g, footer);
                    // console.log(result);
                    fsPromises.writeFile(path.join(destinationPath, 'index.html'), result, {
                      encoding: 'utf8',
                      flag: 'w',
                      mode: 0o666
                    })
                      .then(function () {
                        console.log('Assembly index.html success');
                        console.log('Build complete');
                      });
                  });
              });

          });
      });
  });

// create style.css file

fsPromises.writeFile(
  path.join(destinationPath, 'style.css'), '', {
    encoding: 'utf8',
    flag: 'w',
    mode: 0o666
  })
  .then(function () {
    fs.readdir(stylesSourcePath,
      {withFileTypes: true},
      (err, files) => {
        if (err)
          console.log(err);
        else {

          files.forEach(file => {
            // console.log(file);
            const extension = path.extname(file.name);
            if (extension === '.css') {
              fsPromises.readFile(path.join(stylesSourcePath, file.name))
                .then(value => {
                  fsPromises.appendFile(path.join(destinationPath, 'style.css'), value)
                    .then(function () {
                      // console.log(`Styles from ${file.name} added to bundle.css`);
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                  fsPromises.appendFile(path.join(destinationPath, 'style.css'), '\n')
                    .then(function () {
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                });
            }
          });

          console.log('Assembly style.css success');
        }
      });
  })
  .catch(function (error) {
    console.log(error);
  });