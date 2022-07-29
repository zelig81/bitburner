/** @param {NS} ns */
export async function main(ns) {
  const scripts = {
    "contracts.js": [],
    "hacknet.js": [18],
    "customStats.js": [],
  }
  let execServer = ns.getHostname()
  for (let script in scripts) {
    ns.exec(script, execServer, 1, scripts[script])
  }
}
