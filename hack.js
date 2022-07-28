/** @param {NS} ns */
export async function main(ns) {
  var target = ns.args[0];
  var growthRatio = 2;
  var securityThresh = ns.getServerMinSecurityLevel(target) * 3 - 1;
  var moneyAvailable = ns.args[1]

  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(target);
  }
  if (ns.fileExists("FTPCrack.exe", "home")) {
    ns.ftpcrack(target);
  }
  ns.nuke(target);

  while(true) {
    let money = await ns.getServerMoneyAvailable(target)
    if (money < moneyAvailable) {
      ns.print(`there is almost no money: \$${money}`)
      break
    }
    let securityLevel = ns.getServerSecurityLevel(target)
    if (securityLevel > securityThresh) {
      ns.print(`security level=${securityLevel}, security threshold=${securityThresh}`)
      await ns.weaken(target);
    } else if (ns.growthAnalyze(target, growthRatio) < 5) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}
