const { parse, join } = require('path');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);

const writeFile = async (file) => {
    const { createReadStream, filename } = file.file;
    const stream = createReadStream();
    let { ext, name } = parse(filename);

    const dir = 'uploadFiles';
    await mkdir(dir, { recursive: true });


    name = `single${Math.floor(Math.random() * 100) + 1}`
    let url = join(__dirname, `../${dir}/${name}-${Date.now()}${ext}`);
    const imageStream = await fs.createWriteStream(url);
    await stream.pipe(imageStream);
    url = `${process.env.APP_BASE_URL}${url.split('uploadFiles'[1])}`
    return url
}

module.exports = writeFile;

