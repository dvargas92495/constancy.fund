const fs = require("fs");
const contents = fs.readFileSync("out/index.js").toString();
fs.writeFileSync(
  "out/index.js",
  `Object.keys(require.cache).forEach(function(key) {
  delete require.cache[key];
}); 
performance = [{time: process.hrtime.bigint(), message: "started"}];
${contents}
performance.push({ time: process.hrtime.bigint(), message: "finished setup" });
performance.slice(1).forEach((k, i) => {
  console.log(
    k.message,
    "took",
    Number(k.time - performance[i].time) / 1000000,
    "ms"
  );
});
`
);
