/** @param {NS} ns */
export async function main(ns) {
  const servers = [
    "foodnstuff", // 1 hack, 0 port <- 0
    "n00dles", // 1 hack, 0 port <- 0
    "sigma-cosmetics", // 5 hack, 0 port <- 0
    "joesguns", // 10 hack, 0 port <- 0
    "nectar-net", // 20 hack, 0 port, <- iron-gym
    "CSEC", // 60 hack, 1 port <- iron-gym
    "hong-fang-tea", // 30 hack, 0 port <- 0
    "harakiri-sushi", // 40 hack, 0 port <- 0
    "neo-net", // 50 hack, 1 port <- nectar-net
    "zer0", // 75 hack, 1 ports <- iron-gym
    "max-hardware", // 80 hack, 1 ports <- harakiri-sushi
    "iron-gym", // 100 hack, 1 port <- 0
    "phantasy", // 100 hack, 2 ports <- csec <- foodstuff
    "silver-helix", // 150 hack, 2 ports <- csec <- foodstuff
    "omega-net", // 198 hack, 2 ports <- zer0
    "avmnite-02h", // 213 hack, 2 ports <- phantasy
    "crush-fitness", // 246 hack, 2 ports <- phantasy
    "johnson-ortho", // 261 hack, 2 ports <- omega-net
    "the-hub", // 285 hack, 2 ports <- phantasy
    "I.I.I.I", // 344 hack, 3 ports <- crush-fitness
    "computek", // 365 hack, 3 ports <- neo-net
    "netlink", // 396 hack, 3 ports <- silver-helix
    "rothman-uni", // 398 hack, 3 ports <- avmnite-02h


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
