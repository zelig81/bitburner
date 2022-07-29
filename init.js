/** @param {NS} ns */
export async function main(ns) {
  const files = [
    "contracts.js",
    "crimes.js",
    "customStats.js",
    "_hack.js",
    "hacknet.js",
    "interface.js",
    "netcrawler.js",
    "runner.js",
    "sscheduler.js",
  ]
  for (let file of files) {
    await ns.wget(`https://raw.githubusercontent.com/zelig81/bitburner/main/${file}`, file);
    ns.tprint(`file ${file} downloaded...`)
  }

}
