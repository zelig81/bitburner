/** @param {NS} ns */
export async function main(ns) {
  ns.tail()
  ns.disableLog("ALL")
  ns.clearLog()
  let skills = [
    "Blade's Intuition", // name of skill, it's weight
    "Cloak",
    "Short-Circuit",
    "Digital Observer",
    // "Overclock",
    "Reaper",
    "Evasive System",
    "Hands of Midas",
    "Hyperdrive"
  ]
  const overclockMax = 90
  const overclockWeight = 2
  while (true) {
    await ns.sleep(1000)
    let isJoinedDivision = ns.bladeburner.joinBladeburnerDivision()
    if (isJoinedDivision) {
      ns.bladeburner.joinBladeburnerFaction()
      let currentAction = ns.bladeburner.getCurrentAction() // type, name
      let hasUpgrades = true
      while (hasUpgrades) {
        let skillToUpgrade = "Overclock"
        let skillPoints = ns.bladeburner.getSkillPoints()
        let overclockLevel = ns.bladeburner.getSkillLevel("Overclock")
        let overclockCost = ns.bladeburner.getSkillUpgradeCost("Overclock")
        let skillCost = overclockLevel < overclockMax ? overclockCost : 1e12
        let skillWeight = overclockLevel < overclockMax ? 1 / overclockWeight : 1
        let weightedSkill = skillCost
        hasUpgrades = overclockLevel < overclockMax && overclockCost < skillPoints ? true : false
        for (let skill of skills) {
          let skillUpgradeCost = ns.bladeburner.getSkillUpgradeCost(skill)
          if (skillUpgradeCost < skillPoints && weightedSkill > skillUpgradeCost * skillWeight) {
            skillToUpgrade = skill
            skillCost = ns.bladeburner.getSkillUpgradeCost(skill)
            weightedSkill = skillUpgradeCost * skillWeight
            hasUpgrades = true
          }
        }
        if (hasUpgrades) {
          hasUpgrades = ns.bladeburner.upgradeSkill(skillToUpgrade)
          ns.print(`\tupgrade: ${ skillToUpgrade } with result [${ hasUpgrades }], ${ skillPoints } skill points remain`)
        }
        await ns.sleep(200)
      }

      let isActionStarted = false
      let [currentStamina, maxStamina] = ns.bladeburner.getStamina()
      let type = "general"
      if (currentStamina < 0.9 * maxStamina) {
        isActionStarted = ns.bladeburner.startAction("general", "Hyperbolic Regeneration Chamber")
        ns.print(`stamina regen: due to ${ ns.nFormat(currentStamina / maxStamina * 100, "0.00a") }% stamina level`)
        continue
      } else {
        if (currentAction.name === "Hyperbolic Regeneration Chamber") {
          ns.bladeburner.stopBladeburnerAction()
        }
      }
      //todo: add HP check with hospitalization
      // first - blackops
      let blackOpsAvailable = ns.bladeburner.getBlackOpNames()
      type = "blackop"
      for (let action of blackOpsAvailable) {
        let [minChance, maxChance] = ns.bladeburner.getActionEstimatedSuccessChance(type, action)
        let count = ns.bladeburner.getActionCountRemaining(type, action)
        let myRank = ns.bladeburner.getRank()
        let requiredRank = ns.bladeburner.getBlackOpRank(action)
        if (!isActionStarted && minChance > 0.95 && myRank > requiredRank && count > 0) {
          if (currentAction.type !== "BlackOp") {
            isActionStarted = ns.bladeburner.startAction(type, action)
            if (isActionStarted) {
              ns.print(`blackop started: ${ action }`)
              continue
            }
          }
        }
      }

      // second - operations
      let operations = ns.bladeburner.getOperationNames()
      type = "operation"
      let operationName = "Field Analysis"
      let operationGain = 0
      let operationType = "general"
      for (let action of operations) {
        let [minChance, maxChance] = ns.bladeburner.getActionEstimatedSuccessChance(type, action)
        let repGain = ns.bladeburner.getActionRepGain(type, action, ns.bladeburner.getActionMaxLevel(type, action))
        let count = ns.bladeburner.getActionCountRemaining(type, action)
        if (minChance > 0.95 && count > 0) {
          operationGain = repGain
          operationName = action
          operationType = type
        }
      }

      // third - contracts
      let contracts = ns.bladeburner.getContractNames()
      type = "contract"
      for (let action of contracts) {
        let [minChance, maxChance] = ns.bladeburner.getActionEstimatedSuccessChance(type, action)
        let repGain = ns.bladeburner.getActionRepGain(type, action, ns.bladeburner.getActionMaxLevel(type, action))
        let count = ns.bladeburner.getActionCountRemaining(type, action)
        if (minChance > 0.95 && repGain > operationGain && count > 0) {
          operationGain = repGain
          operationName = action
          operationType = type
        }
      }

      // launch of chosen action for operations and contracts
      if (["Idle", "General"].includes(currentAction.type)) {
        isActionStarted = ns.bladeburner.startAction(operationType, operationName)
        if (isActionStarted) {
          ns.print(`${ operationType } started: ${ operationName }, action gain: ${ ns.nFormat(operationGain, "0.00a") }`)
          continue
        }
      }
      // ns.bladeburner.setActionAutolevel(type, action, true) // check if by default true
      // let cityChaos = ns.bladeburner.getCityChaos(ns.bladeburner.getCity())
    }
  }
}
