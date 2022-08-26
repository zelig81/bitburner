/** @param {NS} ns**/
export async function main(ns) {
  ns.disableLog('ALL');
  let player = ns.getPlayer()
  // ns.tprint(`players factions: ${ player.factions }`)
  let purchasedAugmentations = ns.singularity.getOwnedAugmentations(true)
  let factionsToAugmentations = {}
  for (let faction of player.factions) {
    factionsToAugmentations[faction] = {}
    factionsToAugmentations[faction]['reputation'] = ns.singularity.getFactionRep(faction)
    factionsToAugmentations[faction]['augmentations'] = ns.singularity.getAugmentationsFromFaction(faction)
  }
  // ns.tprint(`factions to augmentations: ${ JSON.stringify(factionsToAugmentations) }`)

  let augmentationsToFactions = Object.entries(factionsToAugmentations).reduce((accumulator, factionObject) => {
    for (let augmentation of factionObject[1]['augmentations']) {
      if (!(augmentation in accumulator) && !(augmentation in purchasedAugmentations)) {
        accumulator[augmentation] = { "factions": [], "price": 0, "reputation": 2000000 }
      }
      accumulator[augmentation]["price"] = ns.singularity.getAugmentationPrice(augmentation)
      accumulator[augmentation]["reputation"] = ns.singularity.getAugmentationRepReq(augmentation)
      if (accumulator[augmentation]["reputation"] <= factionObject[1]['reputation'] )
        accumulator[augmentation]["factions"].push(factionObject[0])
    }
    return accumulator

  }, {})
  // ns.tprint(`factions to augmentations: ${ JSON.stringify(augmentationsToFactions) }`)

  let sortedAugmentations = Object.entries(augmentationsToFactions)
  sortedAugmentations.sort((a, b) => augmentationsToFactions[b[0]]["price"] - augmentationsToFactions[a[0]]["price"])
  ns.tprint(`sorted augmentations list to purchase (available due reputation) with factions: ${ JSON.stringify(sortedAugmentations) }`)

  // let justAugmentations = sortedAugmentations.reduce((acc, current) => {
  //   acc.push(Object.keys(current)[0])
  //   return acc
  // }, [])
  // ns.tprint(`sorted augmentations list to purchase (available due reputation): ${ justAugmentations }`)

  // await ns.write(filename, "", "w");
}
