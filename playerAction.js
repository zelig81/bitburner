// heavily refactored https://github.com/kamukrass/Bitburner/blob/develop/playerAction.js
const studyUntilHackLevel = 50;
const moneyThreshold = 2;
const isHomeComputerUpgradeEnabled = true
//todo: make initial money/programs without money
//todo: donate for favors if > 150 favor && money > 500t && there are augmentations to purchase not in the list of other factions
//todo: get overall faction/companies reputation to gain + overall time to gain it.
//todo: reduce list of augmentations to purchase by finding least reputation to gain
// todo: make list of work priority:
/*
- learn hacking
- program creation for start
- crime/company work for initial money till ram upgrad/home servers can be purchased
  - gym? for homicide
  - homicide till 30 kills
- faction work (without 150 favors)
- company work by list
- crime kidnap if no other job
*/

const megaCorps = [
  "ECorp", // mostly hacking
  "Fulcrum Secret Technologies", // hack + combat
  "Blade Industries", // hack+combat
  "NWO", // combat + hack + all skills unique + strength unique
  "Clarke Incorporated", // reputation + charisma + all skills unique + hack unique
  "Four Sigma", // reputation
  "KuaiGong International", // combat + str/agi/def unique
  "OmniTek Incorporated", // combat + reputation + charisma + hack unique
  "Bachman & Associates", // reputation + charisma
  "MegaCorp", // combat unique
];

const cityFactions = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"];

const crimes = [
  // "Shoplift",
  "ASSASSINATION",
  "HOMICIDE",
  "KIDNAP",
  "MUG",
  "ROBSTORE",
  // "Larceny",
  // "Deal Drugs",
  // "Bond Forgery",
  // "Traffick Arms",
  // "Grand Theft Auto",
  // "Heist"
];

const ignoreFactionAugs = new Map([
  ["CyberSec", ['Cranial Signal Processors - Gen II']],
  ["NiteSec", ['DataJack', 'Cranial Signal Processors - Gen III']],
  ["New Tokyo", ['DataJack']],
  ["Chongqing", ['DataJack']],
  ["The Black Hand", ['Embedded Netburner Module Core Implant']],
  ["Sector-12", ['Neuralstimulator']],
])

/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  ns.tail();

  while (true) {
    ns.print("---");

    var sleepTime = 5000;
    var player = ns.getPlayer();
    let currentWork = ns.singularity.getCurrentWork()

    getPrograms(ns);

    joinFactions(ns);

    buyAugments(ns);

    upgradeHomeServer(ns);

    var factionsForReputation = getFactionsForReputation(ns);
    ns.print("Factions for Reputation: " + [...factionsForReputation.keys()]);
    ns.print("Corps to work for reputation: " + getCorpsForReputation(ns))

    var actionUseful = currentActionUseful(ns, factionsForReputation);
    ns.print("Current action useful: " + actionUseful);

    if (!actionUseful) {
      sleepTime = chooseAction(ns, sleepTime, factionsForReputation);
    }

    if (currentWork) {
      if (currentWork.type === "CRIME") {
        ns.print(`Work on crime of type: ${ currentWork.crimeType }`)
      } else if (currentWork.type === "COMPANY") {
        ns.print(`Work for company: ${ currentWork.companyName }`)
      } else if (currentWork.type === "FACTION") {
        ns.print(`Work for faction: ${ currentWork.factionName } by making ${ currentWork.factionWorkType }`)
      } else if (currentWork.type === "CLASS") {
        ns.print(`Study: ${ currentWork.classType } at  ${ currentWork.location }`)
      }
    }
    // ns.print("Employed on jobs: " + JSON.stringify(player.jobs))

    ns.print("Karma: " + ns.heart.break());
    ns.print("Kills: " + player.numPeopleKilled);
    ns.print(`HackNet: hashes / capacity: ${ ns.nFormat(ns.hacknet.numHashes(), "0.0a") } / ${ ns.nFormat(ns.hacknet.hashCapacity(), "0.0a") }`)
    //ns.print("sleep for " + sleepTime + " ms")
    await ns.sleep(sleepTime);
  }
}

function upgradeHomeServer(ns) {
  var player = ns.getPlayer();
  //if (!ns.stock.has4SDataTIXAPI() && player.money > 30e9) {
  // TODO: Consider moving this to the trading script, fits better there (and saves ram here)
  // ns.purchase4SMarketDataTixApi();
  //}
  if (player.money > ns.singularity.getUpgradeHomeRamCost() * moneyThreshold && isHomeComputerUpgradeEnabled) {
    if (!player.factions.includes("CyberSec") || ns.singularity.getUpgradeHomeRamCost() < 2e9
      || (ns.stock.has4SDataTIXAPI() && ns.singularity.getUpgradeHomeRamCost() < 0.2 * player.money)) {
      // Upgrade slowly in the first run while we save money for 4S or the first batch of augmentations
      // Assumption: We wont't join Cybersec after the first run anymore
      // ToDo: Beautification: At Max Home Server Ram, it still tries to upgrade RAM -> prevent that
      ns.print("Upgraded Home Server RAM");
      //ns.toast("Upgraded Home Server RAM");
      ns.singularity.upgradeHomeRam();
    }
  }
}

function getSingleProgram(ns, program, threshold) {
  let player = ns.getPlayer()
  let focus = ns.singularity.isFocused()

  if (!ns.fileExists(program)) {
    if (player.money > threshold * moneyThreshold) {
      ns.singularity.purchaseProgram(program);
    } else {
      ns.singularity.createProgram(program, focus)
    }
  }

}

function getPrograms(ns) {
  let player = ns.getPlayer()
  if (!player.tor) {
    if (player.money > 2 * 10 ** 5 * moneyThreshold) {
      ns.singularity.purchaseTor();
      ns.print("Purchased TOR");
      ns.toast("Purchased TOR");
    }
    else {
      return;
    }
  }

  getSingleProgram(ns, "BruteSSH.exe", 5 * 10 ** 5)
  getSingleProgram(ns, "FTPCrack.exe", 1.5 * 10 ** 6)
  getSingleProgram(ns, "relaySMTP.exe", 5 * 10 ** 5)

  player = ns.getPlayer()
  if (ns.stock.has4SDataTIXAPI() && player.money > 280 * 10 ** 6 * moneyThreshold) {
    // do not buy more before 4s data access bought
    ns.singularity.purchaseProgram("HTTPWorm.exe");
    ns.singularity.purchaseProgram("SQLInject.exe");
  }
}

function chooseAction(ns, sleepTime, factions) {
  let focus = ns.singularity.isFocused();
  var player = ns.getPlayer();
  let currentWork = ns.singularity.getCurrentWork()

  //ns.print("Focus: " + focus);
  if (
    player.skills.hacking < studyUntilHackLevel &&
    (currentWork == null ||
    currentWork.type !== "CLASS")
  ) {
    ns.singularity.universityCourse("rothman university", "Study Computer Science", focus);
    return sleepTime;
  }


  if (factions.size > 0) {
    var faction = factions.keys().next().value;
    const factionsFieldWork = ["Slum Snakes", "Tetrads"];
    var wType = "Hacking Contracts";
    if (factionsFieldWork.includes(faction)) {
      wType = "Field Work";
    }
    const success = ns.singularity.workForFaction(faction, wType, focus);
    if (success) {
      ns.print("Start working for faction " + faction);
      ns.toast("Start working for faction " + faction, "success", 5000);
      return sleepTime;
    } else {
      ns.print("Could not perform intended action: " + faction + " -> " + wType);
    }
  }

  var corpsToWorkFor = getCorpsForReputation(ns);

  if (player.skills.hacking >= 1100 && corpsToWorkFor.length > 0) {
    applyForPromotion(ns, corpsToWorkFor[0]);
    ns.print(`chooseAction: corpsToWorkFor: ${ corpsToWorkFor }`)
    ns.print("Start working for " + corpsToWorkFor[0]);
    ns.toast("Start working for " + corpsToWorkFor[0]);
  } else {
    ns.toast("Crime Time!");
    var crimeTime = commitCrime(ns);
  }
  return sleepTime;
}

function applyForPromotion(ns, corpToWorkFor) {
  let focus = ns.singularity.isFocused();
  let currentWork = ns.singularity.getCurrentWork()

  var career = "it"

  var success = ns.singularity.applyToCompany(corpToWorkFor, career);

  if (success) {
    ns.toast("Got a company promotion!");
  }
  if (currentWork == null || (currentWork.type !== "COMPANY" || currentWork.companyName !== corpToWorkFor)) {
    ns.singularity.workForCompany(corpToWorkFor, focus);
  }

}

function currentActionUseful(ns, factions) {
  let currentWork = ns.singularity.getCurrentWork()
  var player = ns.getPlayer();
  var playerControlPort = ns.getPortHandle(3); // port 2 is hack
  if (currentWork) {
    if (currentWork.type == "CLASS") {
      if (player.skills.hacking < studyUntilHackLevel) { // ns.getHackingLevel()
        return true;
      }
    }
    if (currentWork.type === "CREATE_PROGRAM") {
      return true;
    }
    if (currentWork.type === "FACTION") {
      if (factions.has(currentWork.factionName)) {
        var repRemaining = factions.get(currentWork.factionName)
        if (repRemaining > 0) {
          // working for a faction needing more reputation for augmentations
          if (playerControlPort.empty() && currentWork.factionWorkType === "HACKING") {
            // only write to ports if empty
            ns.print(`run ns.share() to increase faction [${ currentWork.factionName }] reputation`);
            playerControlPort.write(true);

          }
          else if (playerControlPort.empty()) {
            // only write to ports if empty
            playerControlPort.write(false);
          }
          let factionRepGain = ns.formulas.work.factionGains(player, "HACKING", ns.singularity.getFactionFavor(currentWork.factionName))
          let focusBonus = ns.singularity.getOwnedAugmentations().includes("Neuroreceptor Management Implant") ? 1 : 0.8;
          let appliedFocusBonus = ns.singularity.isFocused() ? 1 : focusBonus
          let reputationGain = (1 + (1 * Math.pow(player.skills.intelligence, 0.8)) / 600) * factionRepGain.reputation * factionRepGain.hackExp * appliedFocusBonus

          let reputationTimeRemaining = repRemaining / reputationGain;
          let humanReadableReputationTimeRemaining = ""
          let hours = Math.floor(reputationTimeRemaining / 3600)
          let minutes = Math.floor((reputationTimeRemaining - hours * 3600) / 60)
          let seconds = Math.floor(reputationTimeRemaining - hours * 3600 - 60 * minutes)

          ns.print(`Reputation remaining: ${ns.nFormat(repRemaining, "0.0a")} in ${hours} hours ${minutes} minutes ${seconds} seconds`);
          return true;
        } else {
          ns.print("Max Reputation @ " + currentWork.factionName);
          ns.toast("Max Reputation @ " + currentWork.factionName, "success", 5000);
          return false;
        }
      } else {
        if (playerControlPort.empty()) {
          // only write to ports if empty
          playerControlPort.write(false);
        }
      }

    } else { // not hacking for a faction
      if (playerControlPort.empty()) {
        // only write to ports if empty
        playerControlPort.write(false);
      }
    }

    if (currentWork.type === "COMPANY") {
      var reputation = ns.singularity.getCompanyRep(currentWork.companyName)
      ns.print("Company reputation: " + ns.nFormat(reputation, "0a"));
      if (reputation > 3 * 10 ** 5 || factions.has(currentWork.companyName)) {
        return false;
      } else {
        applyForPromotion(ns, currentWork.companyName);
        return true;
      }
    }
    if (currentWork.type === "CRIME") {
      for (let crime of crimes) {
        let crimeChance = ns.singularity.getCrimeChance(crime);
        if (
          (currentWork.crimeType == "ASSASSINATION" && player.numPeopleKilled < 30 && crimeChance > 0.98) ||
          (currentWork.crimeType == "MUG" && player.money < 9 * 10 ** 6) ||
          (currentWork.crimeType == "ASSASSINATION" && player.numPeopleKilled < 30 && crimeChance > 0.98) ||
          (currentWork.crimeType == "HOMICIDE" && player.numPeopleKilled < 30 && crimeChance > 0.98) ||
          (currentWork.crimeType == "KIDNAP" && crimeChance > 0.25) // best for intelligence and time to skills
        ) {
          return true;
        }
      }
      return false;
    }
  }
  return false;
}

function getFactionsForReputation(ns) {
  var player = ns.getPlayer();
  var factionsWithAugmentations = new Map();
  for (const faction of player.factions) {
    var maxReputationRequired = maxAugmentRep(ns, faction);
    let factionReputation = ns.singularity.getFactionRep(faction)
    if (factionReputation < maxReputationRequired) {
      factionsWithAugmentations.set(faction, maxReputationRequired - factionReputation);
    }
  }
  return factionsWithAugmentations;
}

function getCorpsForReputation(ns) {
  var corpsWithoutFaction = []
  let player = ns.getPlayer()
  for (const corp of megaCorps) {
    if (!player.factions.includes(corp) && maxAugmentRep(ns, corp) > 0) {
      corpsWithoutFaction.push(corp);
    }
  }
  return corpsWithoutFaction;
}

function buyAugments(ns) {
  // todo: refactor for better understanding
  var player = ns.getPlayer();
  var sortedAugmentations = [];

  for (const faction of player.factions) {
    var purchasedAugmentations = ns.singularity.getOwnedAugmentations(true);
    var augmentations = ns.singularity.getAugmentationsFromFaction(faction);
    var newAugmentations = augmentations.filter(val => !purchasedAugmentations.includes(val));
    for (const augmentation of newAugmentations) {
      if (ns.singularity.getAugmentationRepReq(augmentation) <= ns.singularity.getFactionRep(faction)) {
        let price = ns.singularity.getAugmentationPrice(augmentation);
        sortedAugmentations.push([augmentation, price, faction]);
      }
    }
  }

  // make map of augmentations to factions
  let augmentationsOfFactions = {}
  for (let augmentation of sortedAugmentations) {
    if (!(augmentation[0] in augmentationsOfFactions)) {
      augmentationsOfFactions[augmentation[0]] = []
    }
    augmentationsOfFactions[augmentation[0]].push(augmentation[2])
  }

  // costs are the second element in the 2d arrays
  sortedAugmentations.sort((a, b) => b[1] - a[1]);
  var augmentationCostMultiplier = 1;
  var preReqAugments = [];
  var skipAugments = [];
  var overallAugmentationCost = 0;
  for (var i = 0; i < sortedAugmentations.length; i++) {


    for (var preReqAug of ns.singularity.getAugmentationPrereq(sortedAugmentations[i][0])) {
      if (!preReqAugments.includes(preReqAug) && !purchasedAugmentations.includes(preReqAug)) {
        preReqAugments.push(preReqAug);
        //ns.print("move prereq aug: " + preReqAug + " before " + sortedAugmentations[i][0]);
        sortedAugmentations.splice(i, 0, [preReqAug, ns.singularity.getAugmentationPrice(preReqAug)]);
        //overallAugmentationCost += sortedAugmentations[i][1] * augmentationCostMultiplier;
        if (i >= 0) {
          i--;
        }
        //augmentationCostMultiplier *= 2;
      }
    }
    if (i >= 0) {
      if (i > 0 && sortedAugmentations[i][0] == sortedAugmentations[i - 1][0] || skipAugments.includes(sortedAugmentations[i][0])) {
        //ns.print("remove duplicate aug: " + sortedAugmentations[i][0]);
        sortedAugmentations.splice(i, 1);
        i--;
        continue;
      }
      else if (preReqAugments.includes(sortedAugmentations[i][0])) {
        //ns.print("skip prereq aug: " + sortedAugmentations[i][0]);
        skipAugments.push((sortedAugmentations[i][0]));
      }
      overallAugmentationCost += sortedAugmentations[i][1] * augmentationCostMultiplier;
      augmentationCostMultiplier *= 1.9;
    }
  }
  let printableSortedAugmentations = sortedAugmentations.map(([augmentation, price, _]) => [augmentation, ns.nFormat(price, "$0.0a"), augmentationsOfFactions[augmentation]])

  ns.print("Augmentation purchase order: " + JSON.stringify(printableSortedAugmentations))
  ns.print("Current augmentation purchase cost: " + ns.nFormat(overallAugmentationCost, "0.0a"));

  if (player.money > overallAugmentationCost) {
    // decide when it's time to install
    // buy augmentation list
    // buy flux governors
    // ns.singularity.installAugmentations(cbScript)
  }
}

function maxAugmentRep(ns, faction) {
  var purchasedAugmentations = ns.singularity.getOwnedAugmentations(true);
  var augmentations = ns.singularity.getAugmentationsFromFaction(faction);
  var newAugmentations = augmentations.filter(val => !purchasedAugmentations.includes(val));

  if (newAugmentations.length > 0) {
    // go for the last augmentation in the list. Assumption: Higher rep augs from follow-up factions
    var maxReputationRequired = 0;
    for (const augmentation of newAugmentations) {
      if (ignoreFactionAugs.has(faction)) {
        if (ignoreFactionAugs.get(faction).includes(augmentation)) {
          // ignore some augmentations which we want to buy from later factions
          //ns.print("Ignore aug " + augmentation + " for faction " + faction)
          continue;
        }
      }
      maxReputationRequired = Math.max(maxReputationRequired, ns.singularity.getAugmentationRepReq(augmentation));
      let donateFavorLevel = ns.formulas.reputation.calculateFavorToRep(150 - ns.singularity.getFactionFavor(faction))
      if (maxReputationRequired > donateFavorLevel) {
        return donateFavorLevel
      }
    }
    return maxReputationRequired;
    // go for the last augmentation in the list. Assumption: Higher rep augs from follow-up factions
    // some augs will be completely ignored however
    //return ns.singularity.getAugmentationRepReq(newAugmentations[newAugmentations.length - 1]);
  }
  return 0;
}

function joinFactions(ns) {
  const newFactions = ns.singularity.checkFactionInvitations();
  for (const faction of newFactions) {
    if (!cityFactions.includes(faction)) {
      ns.singularity.joinFaction(faction);
      ns.print("Joined " + faction);
    }
  }
}

function commitCrime(ns) {
  let currentWork = ns.singularity.getCurrentWork()
  let focus = ns.singularity.isFocused();
  let player = ns.getPlayer()
  // Calculate the risk value of all crimes

  var bestCrime = "Kidnap and Ransom";
  var bestCrimeValue = 0;
  var bestCrimeStats = {};
  for (let crime of crimes) {
    let crimeChance = ns.singularity.getCrimeChance(crime);
    var crimeStats = ns.singularity.getCrimeStats(crime);
    if (crime == "ASSASSINATION" && player.numPeopleKilled < 30 && crimeChance > 0.98) {
      bestCrime = "ASSASSINATION";
      bestCrimeStats = crimeStats;
      break;
    } else if (crime == "HOMICIDE" && player.numPeopleKilled < 30 && crimeChance > 0.98) {
      bestCrime = "HOMICIDE";
      bestCrimeStats = crimeStats;
      break;
    } else if (crime == "KIDNAP" && crimeChance > 0.5) {
      bestCrime = "KIDNAP";
      bestCrimeStats = crimeStats;
      break;
    } else if (crime == "MUG" && crimeChance > 0.5 && player.money < 9 * 10 ** 6) {
      bestCrime = "MUG";
      bestCrimeStats = crimeStats;
      break;
    } else if (crime == "ROBSTORE" && crimeChance > 0.5 && player.money < 9 * 10 ** 6) {
      bestCrime = "ROBSTORE";
      bestCrimeStats = crimeStats;
      break;
    }

    // var crimeValue = 0;
    // if (player.strength < combatStatsGoal) {
    //   crimeValue += 100000 * crimeStats.strength_exp;
    // }
    // if (player.defense < combatStatsGoal) {
    //   crimeValue += 100000 * crimeStats.defense_exp;
    // }
    // if (player.dexterity < combatStatsGoal) {
    //   crimeValue += 100000 * crimeStats.dexterity_exp;
    // }
    // if (player.agility < combatStatsGoal) {
    //   crimeValue += 100000 * crimeStats.agility_exp;
    // }
    // // crimeValue += crimeStats.money;
    // //ns.print(ns.nFormat(crimeChance,"0.00a")+"/"+ns.nFormat(crimeStats.time,"000a")+"|"+crimeStats.strength_exp + "|" + crimeStats.defense_exp + "|" + crimeStats.dexterity_exp + "|" + crimeStats.agility_exp + "|" + ns.nFormat(crimeStats.money,"0a")+"|"+crime);
    // crimeValue = crimeValue * crimeChance / (crimeStats.time + 10);
    // if (crimeValue > bestCrimeValue) {
    //   bestCrime = crime;
    //   bestCrimeValue = crimeValue;
    //   bestCrimeStats = crimeStats;
    // }
  }

  if (currentWork == null || currentWork.crimeType !== bestCrime) {
    ns.singularity.commitCrime(bestCrime, focus);
  }

  ns.print("Crime value " + ns.nFormat(bestCrimeValue, "0a") + " for " + bestCrime);
  return bestCrimeStats.time + 10;
}

/*
TODO: Implement creating programs manual in the first run
createProgram()
BruteSSH.exe: 50
FTPCrack.exe: 100
relaySMTP.exe: 250
HTTPWorm.exe: 500
SQLInject.exe: 750
DeepscanV1.exe: 75
DeepscanV2.exe: 400
ServerProfiler.exe: 75
AutoLink.exe: 25
*/
