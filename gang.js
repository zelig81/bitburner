/** @param {NS} ns */
export async function main(ns) {
  ns.tail()
  ns.disableLog("ALL")
  ns.print("---")
  let members = ns.gang.getMemberNames()
  ns.print(`members: ${ JSON.stringify(members) }`)
  let equipment = ns.gang.getEquipmentNames()
  ns.print(`equipment: ${ JSON.stringify(equipment) }`)
  for (let member of members) {
    ns.gang.setMemberTask(member, "Train Combat")
    ns.gang.ascendMember(member)
    for (let item of equipment) {
      ns.gang.purchaseEquipment(member, item)
    }
  }
}
