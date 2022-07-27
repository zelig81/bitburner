/** @param {NS} ns */
export async function main(ns) {
  const files = [
    "_runner.js",
    "_hack.js"
  ]
  for (let file of files) {
    await ns.wget(`https://raw.githubusercontent.com/zelig81/bitburner/main/${file}`, file);
    ns.alert(`file ${file} downloaded...`)
  }

}
