/** @param {NS} ns */
export async function main(ns) {
  const files = [
    "_runner.js",
    "_hack.js"
  ]
  files.map((file) => {
    await ns.wget(`https://raw.githubusercontent.com/zelig81/bitburner/main/${file}`, file);
  })

}
