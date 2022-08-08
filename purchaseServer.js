/** @param {NS} ns */
export async function main(ns) {
  let maxRam = ns.args.length == 2 ? parseInt(ns.args[1]) : ns.getPurchasedServerMaxRam()
  let humanMaxRam = ns.nFormat(maxRam * 1024 * 1024 * 1024, "0b")
  ns.tprint(`Cost of server with ${ humanMaxRam }: ${ ns.nFormat(ns.getPurchasedServerCost(maxRam), "0.0a") }`)
  let numberOfServers = ns.args.length > 0 ? parseInt(ns.args[0]) : 1
  for (let i = 0; i < numberOfServers; i++) {
    let result = ns.purchaseServer(`server-${ humanMaxRam }`, maxRam)
    ns.tprint(`purchase [${ result }] server`)
  }
}
