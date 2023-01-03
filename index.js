#!/usr/bin/env node

const fs = require("fs");

const flags = process.argv.slice(2);
const logFilePath = flags[0];
const outputPath = flags.includes("-o") ? flags[flags.indexOf("-o") + 1] : null;

if (flags.includes("-h")) {
  console.log(`
  Penggunaan: mytools [file] [options]

  file:          Path dari file log yang ingin diproses
  options:
    -h           Menampilkan petunjuk penggunaan
    -t [format]  Format output, diperbolehkan "text" atau "json" (default: "text")
    -o [path]    Path dimana output akan disimpan (default: null)

  contoh : 
  $ mytools /var/log/nginx/error.log -t json (Mengkonversi file menjadi json)
  $ mytools /var/log/nginx/error.log -t text (Mengkonversi file menjadi text)

  $ mytools /var/log/nginx/error.log (Default output PlainText)

  $ mytools /var/log/nginx/error.log -o /User/johnmayer/Desktop/nginxlog.txt 
    -(Mengkonversi file dan memilih lokasi penyimpanan output, format file harus ditulis (log.txt atau log.json))

  $ mytools /var/log/nginx/error.log -t json -o /User/johnmayer/Desktop/nginxlog.json
    -(Mengkonversi file dan memilih lokasi penyimpanan output)
  `);
  process.exit(0);
}

fs.readFile(logFilePath, "utf-8", (error, data) => {
  if (error) {
    console.log(error);
  }

  let output;

  // flag -o only
  if (flags.includes("-o")) {
    const check = outputPath.split("/");
    const lastElement = check.slice(-1)[0];
    const checkFormat = lastElement.split(".");

    if (checkFormat.includes("json")) {
      output = JSON.stringify(data);
      fs.writeFile(outputPath, output, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`File log telah disimpan pada ${outputPath}`);
        }
      });
    }
    if (checkFormat.includes("txt")) {
      fs.writeFile(outputPath, data, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`File log telah disimpan pada ${outputPath}`);
        }
      });
    }
    return;
  }

  if (flags.includes("-t") && flags.includes("json")) {
    output = JSON.stringify(data);
    if (outputPath) {
      fs.writeFile(outputPath, output, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`File log telah disimpan pada ${outputPath}`);
        }
      });
    } else {
      console.log(output);
    }
  } else if (flags.includes("-t") && flags.includes("text")) {
    if (outputPath) {
      fs.writeFile(outputPath, data, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`File log telah disimpan pada ${outputPath}`);
        }
      });
    } else {
      console.log(data);
    }
  } else {
    console.log(data);
  }
});
