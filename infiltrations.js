/** @param {NS} ns */
export async function main(ns) {
  let infiltrations = ns.infiltration.getPossibleLocations()
  ns.tail()
  ns.clearLog()
  for (let infiltration of infiltrations) {
    let props = ns.infiltration.getInfiltration(infiltration.name)
    if (props.difficulty < 1)
      ns.print(`${ infiltration.city }: ${ infiltration.name }, ${ ns.nFormat(props.difficulty, "0.0a") } dif, ${ ns.nFormat(props.reward.sellCash * ns.getBitNodeMultipliers().InfiltrationMoney, "$0.00a") }, ${ ns.nFormat(props.reward.tradeRep * ns.getBitNodeMultipliers().InfiltrationRep, "0.00a") } rep`)
  }
}
