# convertFiles
Convertir archivos o imágenes

# Program con argumento
const program = require('commander'); 
program.version('0.0.1');

program
  .command('format')
  .arguments("<year>")
  .option("--input <pathin>", "specify folder")
  .option("--output <pathou>", "specify folder")
  .option("--format <number>", "input number")
  .action(function (year, options) {
      console.log(`el argumento es : ${year} | <<path input : ${options.input} >> | << path output : ${options.output} >> | << format : ${options.format} >>`);
      startConvertImg(options.input, options.output, options.format)
  });
program.parse(process.argv); 