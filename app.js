const { promisify } = require('util');
const fs = require('fs');
const path = require("path");
const convert = require('heic-convert');

/** program */
const program = require('commander'); 
program.version('0.0.1');

program
  .command('format')
  .option("--input <pathin>", "specify folder")
  .option("--output <pathou>", "specify folder")
  .option("--format <number>", "input number")
  .action(function (options) {
      console.log(`<<path input : ${options.input} >> | << path output : ${options.output} >> | << format : ${options.format} >>`);
      startConvertImg(options.input, options.output, options.format)
  });
program.parse(process.argv); 

/** Fin program */

const convertImg = async (name, pathOut) => {
    const inputBuffer = await promisify(fs.readFile)(name);
    const images = await convert.all({
        buffer: inputBuffer, // the HEIC file buffer
        format: 'JPEG'       // output format
    });
    for (let idx in images) {
        const image = images[idx];
        const outputBuffer = await image.convert();
        var nameFile = path.basename(name);
        await promisify(fs.writeFile)(`${pathOut}/${nameFile}.jpg`, outputBuffer);
    }
};


const getAllFiles = async function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []

    await files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file))
            //arrayOfFiles.push(file)
        }
    })

    return arrayOfFiles
}


async function startConvertImg(pathIn, pathOut, ConvertFormat) {
    try {
        const arrayFile = await getAllFiles(pathIn);
        console.log(arrayFile);
        console.log(" heic/jpg : " + ConvertFormat);
        let i = 0;
        do {
            await convertImg(arrayFile[i], pathOut)
                .then(console.log(".... convitiendo " + arrayFile[i]))
                .finally(console.log("Archivo " + arrayFile[i] + " finalizado correctamente"))
            i = i + 1;
        } while (i < arrayFile.length);
    } catch {
        console.log("ERROR, revisa el comando --help");
    }
}

/* 
    pathIn C:\\Users\\ADMIN\\Downloads\\convert
    pathOut C:\\Users\\ADMIN\\Downloads\\finalizado
    ConvertFormat (1 = 'heic/png'|2 'jpg/heic'|3|4)    
*/

//startConvertImg('C:\\Users\\ADMIN\\Downloads\\convert', 'C:\\Users\\ADMIN\\Downloads\\finalizado', 1)