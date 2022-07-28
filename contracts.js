/** @param {NS} ns */
export async function main(ns) {
  const servers = [
    "foodnstuff", // 1 hack, 0 port <- 0
    "n00dles", // 1 hack, 0 port <- 0
    "sigma-cosmetics", // 5 hack, 0 port <- 0
    "joesguns", // 10 hack, 0 port <- 0
    "nectar-net", // 20 hack, 0 port, <- iron-gym
    "hong-fang-tea", // 30 hack, 0 port <- 0
    "harakiri-sushi", // 40 hack, 0 port <- 0
    "neo-net", // 50 hack, 1 port <- nectar-net
    "zer0", // 75 hack, 1 ports <- iron-gym
    "max-hardware", // 80 hack, 1 ports <- harakiri-sushi
    "iron-gym", // 100 hack, 1 port <- 0
    "phantasy", // 100 hack, 2 ports <- csec <- foodstuff
    "silver-helix", // 150 hack, 2 ports <- csec <- foodstuff
    "omega-net", // 198 hack, 2 ports <- zer0
    // "avmnite-02h", // 213 hack, 2 ports <- phantasy

  ]
  let execServer = ns.getHostname()
  let threads = ns.args[0]
  let moneyThreshold = ns.args[1]
  for (let server of servers) {
    if (ns.getServer(server).hackDifficulty < ns.getHackingLevel() && ns.getScriptRam("_hack.js") < ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) {
      ns.exec("_hack.js", execServer, threads , server, moneyThreshold)
      await ns.sleep(500)
    }
  }
}
