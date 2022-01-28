const esbuild = require("esbuild").build;
const fs = require("fs");
const readDir = (s) =>
  fs.existsSync(s)
    ? fs
        .readdirSync(s, { withFileTypes: true })
        .flatMap((f) =>
          f.isDirectory() ? readDir(`${s}/${f.name}`) : [`${s}/${f.name}`]
        )
    : [];

const modulesToTranspile = ["@mui/material", "pdfjs-dist"];

console.log(
  "About to transpile",
  modulesToTranspile.length,
  "modules from esm to cjs"
);
const files = modulesToTranspile.flatMap((m) => readDir(`./node_modules/${m}`));
const jsFiles = files.filter((s) => /\.js$/.test(s));
const jsonFiles = files.filter((s) => /\.json$/.test(s));
console.log("transpiling", jsFiles.length, "now...");
let count = 0;
Promise.all(
  jsFiles.map((s) =>
    esbuild({
      entryPoints: [s],
      outfile: s,
      format: "cjs",
      allowOverwrite: true,
      target: "node14",
    }).then(() => {
      count++;
      if (count % 500 === 0) {
        console.log("done transpiling", count, "files...");
      }
    })
  )
)
  .then((s) => console.log("transpiled", s.length, "files"))
  .then(() => {
    console.log(
      "now checking",
      jsonFiles.length,
      "package.jsons to remove `type:module`..."
    );
    jsonFiles.forEach((jsonFile) => {
      const packageJson = JSON.parse(fs.readFileSync(jsonFile).toString());
      if (packageJson.type === "module") {
        delete packageJson.type;
        fs.writeFileSync(jsonFile, JSON.stringify(packageJson, null, 4));
        console.log("overwrote", jsonFile);
      }
    });
  });
