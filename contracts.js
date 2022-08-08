/** @param {NS} ns **/
export async function main(ns) {
  var serverList;
  var filename = "contract.txt"
  async function scanServers() {//Finds all servers
    serverList = ns.scan("home"); let serverCount = [serverList.length, 0]; let depth = 0; let checked = 0; let scanIndex = 0;
    while (scanIndex <= serverCount[depth] - 1) {
      let results = ns.scan(serverList[checked]); checked++;
      for (let j = 0; j <= results.length - 1; j++) {
        if (results[j] != "home" && !serverList.includes(results[j])) {
          serverList.push(results[j]); serverCount[depth + 1]++
        }
      }
      if (scanIndex == serverCount[depth] - 1) { scanIndex = 0; depth++; serverCount.push(0) } else { scanIndex++ };
    }
  }

  while (true) {
    await scanServers()
    await ns.write(filename, "", "w");
    for (let j = 0; j < serverList.length; j++) {
      var files = ns.ls(serverList[j], "cct")
      for (let _file of files) {
        await ns.write(filename, `${serverList[j]} -> ${_file} (type: ${ns.codingcontract.getContractType(_file, serverList[j])})\n`, "a");
      }
    }
    await ns.asleep(1000)
  }
}
