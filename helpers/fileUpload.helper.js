const { parse, join } = require('path');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);

const writeFile = async (file, dirName) => {
  const { createReadStream, filename } = file.file;
  const stream = createReadStream();
  let { ext, name } = parse(filename);

  let uploadFileDirectory = join(__dirname, `../uploadFiles`, dirName);

  await mkdir(uploadFileDirectory, { recursive: true });

  name = `single${Math.floor(Math.random() * 100) + 1}`;
  let pathToFile = join(uploadFileDirectory, `${name}${Date.now()}${ext}`);
  const imageStream = await fs.createWriteStream(pathToFile);
  await stream.pipe(imageStream);
  pathToFile = `${process.env.APP_BASE_URL}${pathToFile.split(
    'uploadFiles'[1],
  )}`;
  return pathToFile;
};

module.exports = writeFile;
