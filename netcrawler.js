/** @param {NS} ns **/

// run netcrawler.js <starting-host>
export async function main(ns) {
  let home = new Object();
  let nodeMap = new Map();
  home.name = ns.args[0] ? ns.args[0] : "home";
  home.parent = null;
  home.neighbors = ns.scan(home.name);
  nodeMap.set(home.name, home);
  crawl(ns, home, nodeMap);
  printMap(ns, home, nodeMap, "");
}

/** @param {NS} ns **/
function crawl(ns, node, nodeMap) {
  node.neighbors.forEach(nodeName => {
    if (nodeMap.has(nodeName) || String(nodeName).startsWith("server-") || String(nodeName).startsWith("hacknet-")) {
      return;
    }
    let newNode = new Object();
    newNode.name = nodeName;
    newNode.parent = node;
    newNode.neighbors = ns.scan(newNode.name);
    nodeMap.set(newNode.name, newNode);
    crawl(ns, newNode, nodeMap);
  });
}

/** @param {NS} ns **/
function printMap(ns, node, nodeMap, indent) {
  let server = ns.getServer(node.name)
  let serverStatus = server.backdoorInstalled ? "B" : (server.hasAdminRights ? "R" : "-")
  ns.tprintf(`${ indent }${ node.name }(${ serverStatus }|${ server.numOpenPortsRequired || "0" }p|${ server.requiredHackingSkill || "0" }>|${ ns.formatRam(server.maxRam) }|${ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumSignificantDigits: 3 }).format(server.moneyMax)})`);
  nodeMap.delete(node.name);
  indent = adjustIndent(indent, node, nodeMap);
  printIndent(ns, indent, node);

  node.neighbors.forEach(adjacentName => {
    if (nodeMap.has(adjacentName)) {
      printMap(ns, nodeMap.get(adjacentName), nodeMap, indent);
    }
  });
}

/** @param {NS} ns **/
function printIndent(ns, indent, node) {
  if (node.neighbors.length > 1) {
    ns.tprintf(indent + "|");
  }
}

function adjustIndent(indent, node, nodeMap) {
  const INDENT_SPACE = 6;
  for (let i = 0; i < INDENT_SPACE; i++) {
    if (i === 0 && hasMoreSiblings(node, nodeMap)) {
      indent += "|";
    } else {
      indent += " ";
    }
  }
  return indent;
}

function hasMoreSiblings(node, nodeMap) {
  let hasSiblings = false;
  if (node.parent === null) {
    return hasSiblings;
  }
  node
    .parent
    .neighbors
    .forEach(adjacent => {
      if (nodeMap.has(adjacent)) {
        hasSiblings = true;
      }
    });
  return hasSiblings;
}
