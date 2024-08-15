/** @param {NS} ns **/
export async function main(ns) {
  const doc = eval("document");
  const hook0 = doc.getElementById('overview-extra-hook-0');
  const hook1 = doc.getElementById('overview-extra-hook-1');
  const hook3 = doc.getElementById('overview-extra-hook-1');
  while (true) {
    try {
      const headers = []
      const values = [];
      headers.push("Karma");
      values.push(ns.heart.break());
      headers.push("ScrExp");
      values.push(ns.getTotalScriptExpGain().toPrecision(5) + '/sec');
      headers.push("ScrInc");
      values.push(ns.getScriptIncome().toPrecision(5) + '/sec');

      hook0.innerText = headers.join(" \n");
      hook1.innerText = values.join("\n");
      hook3.innerText = values.join("\n");
    } catch (err) {
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
    ns.atExit(() => { hook0.innerHTML = ""; hook1.innerHTML = ""; });
  }
}
