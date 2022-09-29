/** @param {NS} ns */
export async function main(ns) {
  let listGraftableAug = ns.grafting.getGraftableAugmentations()
  let unsortedAgumentations = []
  let graftableAugmentations = {}
  let timeThreshold = ns.args.length === 0 ? 0 : Number(ns.args[0])
  for (let augmentation of listGraftableAug) {
    let stats = ns.singularity.getAugmentationStats(augmentation)
    let price = ns.grafting.getAugmentationGraftPrice(augmentation)
    let time = ns.grafting.getAugmentationGraftTime(augmentation)
    let prereq = ns.singularity.getAugmentationPrereq(augmentation)
    unsortedAgumentations.push(augmentation)
    graftableAugmentations[augmentation] = { price, time, stats, prereq }
  }
  unsortedAgumentations.sort((a, b) => graftableAugmentations[b]["price"] - graftableAugmentations[a]["price"])
  unsortedAgumentations = unsortedAgumentations.filter(a => timeThreshold === 0 ? true : graftableAugmentations[a].time < timeThreshold * 60e3)
  let augmentationsToGraft = []
  while (unsortedAgumentations.length > 0) {
    if (unsortedAgumentations.indexOf("QLink") !== -1) {
      augmentationsToGraft.push("QLink")
      unsortedAgumentations.splice(unsortedAgumentations.indexOf("QLink"), 1)
    } else if (unsortedAgumentations.indexOf("nickofolas Congruity Implant") !== -1) {
      augmentationsToGraft.push("nickofolas Congruity Implant")
      unsortedAgumentations.splice(unsortedAgumentations.indexOf("nickofolas Congruity Implant"), 1)
    } else {
      let currentAugmentation = unsortedAgumentations[0]
      unsortedAgumentations.splice(0, 1)
      if (graftableAugmentations[currentAugmentation]["prereq"].length > 0) {
        for (let aug of ns.singularity.getAugmentationPrereq(currentAugmentation).reverse()) {
          if (aug in graftableAugmentations) {
            augmentationsToGraft.push(aug)
            unsortedAgumentations.splice(unsortedAgumentations.indexOf(aug), 1)
          }
        }
      }
      augmentationsToGraft.push(currentAugmentation)
    }
  }
  ns.tail()
  ns.disableLog("ALL")
  ns.print("---")
  for (let augmentation of augmentationsToGraft) {
    ns.print(`WARN attempt to graft ${ augmentation } with price ${ ns.nFormat(graftableAugmentations[augmentation]["price"], "0.0a") }`)
    while (true) {
      let currentWork = ns.singularity.getCurrentWork()
      if (currentWork && currentWork.type === "GRAFTING") {
        await ns.sleep(6000)
        continue
      } else {
        break
      }
    }
    while (ns.getPlayer().money < graftableAugmentations[augmentation]["price"]) {
      await ns.sleep(6000)
    }
    if (ns.getPlayer().city !== "New Tokyo") {
      ns.singularity.travelToCity("New Tokyo")
    }
    let result = ns.grafting.graftAugmentation(augmentation)
    if (result) {
      ns.print(`!!!started to graft ${ augmentation }`)
    } else {
      ns.print(`ERROR failed to graft ${ augmentation }`)
    }
  }

}
