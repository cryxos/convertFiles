const { promisify } = require('util');
const fs = require('fs');
const path = require("path");
const convert = require('heic-convert');

const convertImg = async (name) => {
    const inputBuffer = await promisify(fs.readFile)('convert/'+name);
    const images = await convert.all({
        buffer: inputBuffer, // the HEIC file buffer
        format: 'JPEG'       // output format
    });
    for (let idx in images) {
        const image = images[idx];
        const outputBuffer = await image.convert();
        await promisify(fs.writeFile)(`./finalizado/${name}.jpg`, outputBuffer);
    }
};


const getAllFiles = async function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []

    await files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(file, arrayOfFiles)
        } else {
            //arrayOfFiles.push(path.join(dirPath, "/", file))
            arrayOfFiles.push(file)
        }
    })

    return arrayOfFiles
}


async function startConvertImg() {
    try {
        const arrayFile = await getAllFiles('convert');
        console.log(arrayFile);
        let i = 0;
        do {
            await convertImg(arrayFile[i])
                .then(console.log(".... convitiendo " + arrayFile[i]))
                .finally(console.log("Archivo " + arrayFile[i] + " finalizado correctamente"))
            i = i + 1;
        } while (i < arrayFile.length);
    } catch (e) {
        console.log(e);
    }
}

/* 
    pathIn C:\\Users\\ADMIN\\Downloads\\convert
    pathOut C:\\Users\\ADMIN\\Downloads\\finalizado
    ConvertFormat (1 = 'heic/png'|2 'jpg/heic'|3|4)    
*/

startConvertImg()