const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(sourcePath, {encoding: 'utf-8'});

stream.on('readable', function () {
  const data = stream.read();
  if (data) console.log(data);
});
