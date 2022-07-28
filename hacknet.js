/** @param {NS} ns **/

// run scriptName.js numberOfDesiredFullNodes
export async function main(ns) {

  ns.disableLog("ALL");

  const debug = ns.args[1] || false;
  const poolSize = ns.args[0] || 100;

  let fullNodes = 0;

  while (fullNodes != poolSize) {

    let balance = getBalance();

    if (canBuyNode(balance)) {

      ns.hacknet.purchaseNode();
    }

    let nodes = getHackNetNodes();

    nodes.forEach((node) => {

      upgradeNode(node, balance);

    });

    displayStats();

    fullNodes = countFullNodes()

    await ns.sleep(1000);

  }

  function getBalance() {

    return ns.getServerMoneyAvailable("home");
  }


  function canBuyNode(balance) {

    let price = ns.hacknet.getPurchaseNodeCost();

    return balance > price;

  }

  function log(str) {

    if (debug) {
      ns.tprint(str);
    } else {
      ns.print(str);
    }

  }

  function getHackNetNodes() {

    const nodeCount = ns.hacknet.numNodes();
    const hNodes = [];

    for (let i = 0; i < nodeCount; i++) {

      let hNode = ns.hacknet.getNodeStats(i);

      hNodes.push({
        index: i,
        node: hNode,
        maxLevel: false,
        maxRam: false,
        maxCore: false,
      });

    }

    return hNodes;

  }

  function displayStats() {

    ns.clearLog();

    log("--- UPGRADING HACKNET NODES ---");
    log("BALANCE: " + getBalance());
    log("NUMBER OF NODES: " + ns.hacknet.numNodes() + " OF: " + poolSize);
    log("NUMBER OF FULL NODES: " + fullNodes + " OF: " + poolSize);

  }

  function upgradeNode(node, balance) {

    const stats = [
      "Level",
      "Ram",
      "Core"
    ];

    stats.forEach((stat) => {

      if (canUpgrade(stat, node, balance)) {

        log("UPGRADING " + stat + " ON " + node.node.name);

        ns.hacknet["upgrade" + stat](node.index);

      }

    });

  }

  function canUpgrade(stat, node, balance) {

    let cost = ns.hacknet["get" + stat + "UpgradeCost"](node.index);

    if (cost == Infinity) {

      node["max" + stat] = true;

      return false;
    }

    return balance > cost;

  }

  function countFullNodes() {

    let nodes = getHackNetNodes();
    let count = 0;

    nodes.forEach((node) => {

      if (node.maxCore && node.maxLevel && node.maxRam) {

        count += 1;
      }

    });

    return count;

  }
}
