import {
  arrayJumpingGameII,
  compressionIILZ,
  compressionIRLE,
  factor,
  generateIps,
  hammingCodesIntegerToBinary,
  maxProfit,
  mergeOverlap,
  removeInvalidParenthesis,
  solverArrayJumpingGame,
  solverLargestSubset,
  solverWaysToExpress,
  solverWaysToSum,
  solveTriangleSum,
  spiral,
  uniquePathsI,
  uniquePathsII,
} from './_solvers.js'

export async function main(ns) {
  ns.disableLog("ALL");
  // This script could run separately in a loop, howeverit is more RAM-efficient to call the script from a management script
  //while (true) {
  // get all available servers
  const servers = getAllServers(ns)
  const contracts = servers.flatMap((server) => {
    const onServer = ns.ls(server, ".cct").map((contract) => {
      const type = ns.codingcontract.getContractType(contract, server);
      const data = ns.codingcontract.getData(contract, server);
      const result = solve(type, data, server, contract, ns, true);
      return `${ server } - ${ contract } - ${ type } - ${ result || "FAILED!" }`;
    });
    return onServer;
  });
  // ns.tprint("Found " + contracts.length + " contracts");
  contracts.forEach((contract) => void ns.tprint(contract));
  // sleep in case this script is run manually
  //await ns.sleep(60000)
  //}
  return;
}

function getAllServers(ns) {
  var q = [];
  var serverDiscovered = [];

  q.push("home");
  serverDiscovered["home"] = true;

  while (q.length) {
    let v = q.shift();

    let edges = ns.scan(v);

    for (let i = 0; i < edges.length; i++) {
      if (!serverDiscovered[edges[i]]) {
        serverDiscovered[edges[i]] = true;
        q.push(edges[i]);
      }
    }
  }
  //delete serverDiscovered["home"];
  return Object.keys(serverDiscovered);
}

function solve(type, data, server, contract, ns, returnReward) {
  let solution = "";
  //ns.tprint(type);
  switch (type) {
    case "Algorithmic Stock Trader I":
      solution = maxProfit([1, data]);
      break;
    case "Algorithmic Stock Trader II":
      solution = maxProfit([Math.ceil(data.length / 2), data]);
      break;
    case "Algorithmic Stock Trader III":
      solution = maxProfit([2, data]);
      // solution = stockMarketProfit(data, 2)
      break;
    case "Algorithmic Stock Trader IV":
      solution = maxProfit(data);
      break;
    case "Minimum Path Sum in a Triangle":
      solution = solveTriangleSum(data, ns);
      break;
    case "Unique Paths in a Grid I":
      solution = uniquePathsI(data);
      break;
    case "Unique Paths in a Grid II":
      solution = uniquePathsII(data);
      break;
    case "Generate IP Addresses":
      solution = generateIps(data);
      break;
    case "Find Largest Prime Factor":
      solution = factor(data);
      break;
    case "Spiralize Matrix":
      solution = spiral(data);
      break;
    case "Merge Overlapping Intervals":
      solution = mergeOverlap(data);
      break;
    case "Array Jumping Game":
      solution = solverArrayJumpingGame(data);
      break;
    case "Array Jumping Game II":
      solution = arrayJumpingGameII(data);
      break;
    case "Find All Valid Math Expressions":
      solution = solverWaysToExpress(data);
      break;
    case "Subarray with Maximum Sum":
      solution = solverLargestSubset(data);
      break;
    case "Total Ways to Sum":
      solution = solverWaysToSum(data);
      break;
    case "Total Ways to Sum II":
      solution = "";
      break;
    case "Sanitize Parentheses in Expression":
      solution = removeInvalidParenthesis(data);
      break;
    case "Compression I: RLE Compression":
      solution = compressionIRLE(data);
      break;
    case "Compression II: LZ Decompression":
      solution = compressionIILZ(data);
      break;
    case "Compression III: LZ Compression":
      solution = "" //compressionIIILZ(data);
      break;
    case "HammingCodes: Integer to Encoded Binary":
      solution = "";
      break;
    case "HammingCodes: Encoded Binary to Integer":
      solution = "";
      break;
    case "Shortest Path in a Grid":
      solution = ""; //shortestPathInAGrid(data)
      break;
    case "Proper 2-Coloring of a Graph":
      solution = "";
      break;
    default:
      return false;
  }
  return (solution !== "") ? ns.codingcontract.attempt(solution, contract, server, [returnReward]) : "";
}
