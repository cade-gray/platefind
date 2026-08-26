// One-shot assembly: drops the shared stylesheet, the projected US map paths and
// the plate table into the artboards. After this runs the .dc.html files are
// self-contained and are the files to edit by hand.
import fs from "node:fs";

const dir = new URL(".", import.meta.url).pathname;
const css = fs.readFileSync(dir + "_shared.css", "utf8").replace(/\s+$/, "");
const map = JSON.parse(fs.readFileSync(dir + "us-map.json", "utf8")).states;
const mapJs = JSON.stringify(map);

// the plate table lives in Main; Mobile borrows it verbatim
const main = fs.readFileSync(dir + "Main.dc.html", "utf8");
const dataMatch = main.match(/var DATA = (\[[\s\S]*?\n\]);/);
if (!dataMatch) throw new Error("could not find DATA in Main.dc.html");
const dataJs = dataMatch[1];

let changed = [];
for (const file of ["Main.dc.html", "Mobile.dc.html", "Instructions.dc.html"]) {
  const p = dir + file;
  let src = fs.readFileSync(p, "utf8");
  const before = src;
  src = src.replace("/*__CSS__*/", css);
  src = src.replace(/\/\*__MAP__\*\/[\s\S]*?\/\*__MAP__\*\//, mapJs);
  src = src.replace(/\/\*__DATA__\*\/[\s\S]*?\/\*__DATA__\*\//, dataJs);
  if (src !== before) { fs.writeFileSync(p, src); changed.push(file + " " + (src.length / 1024).toFixed(0) + "KB"); }
}
console.log("injected:", changed.join(", ") || "nothing (already assembled)");
