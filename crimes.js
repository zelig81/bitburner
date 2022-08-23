const crimes = [
  "heist",
  "assassination",
  "kidnap",
  "grand theft auto",
  "homicide",
  "larceny",
  "mug someone",
  "rob store",
  "shoplift",
];

/** @param {import(".").NS } ns */
export async function main(ns) {
  // Disable the log
  ns.disableLog("ALL");

  ns.tail(); // Open a window to view the status of the script
  let timeout = 250; // In ms - too low of a time will result in a lockout/hang
  let i = 0

  while (true) {
    await ns.sleep(timeout); // Wait it out first
    if (ns.singularity.isBusy()) continue;
    // /** Calculate the risk value of all crimes */
    // let choices = crimes.map((crime) => {
    //   let crimeStats = ns.getCrimeStats(crime); // Let us look at the important bits
    //   let crimeChance = ns.getCrimeChance(crime); // We need to calculate if its worth it
    //   /** Using probabilty(odds) to calculate the "risk" to get the best reward
    //    *      Risk Value = Money Earned * Odds of Success(P(A) / ~P(A)) / Time taken
    //    *
    //    *  Larger risk values indicate a better choice
    //    */
    //   let crimeRiskValue =
    //     (crimeStats.money * Math.log10(crimeChance / (1 - crimeChance + Number.EPSILON))) /
    //     crimeStats.time;
    //   return [crime, crimeRiskValue];
    // });

    // let bestCrime = choices.reduce((prev, current) => {
    //   return prev[1] > current[1] ? prev : current;
    // });


    let currentCrime = i % 20 === 0 ? "heist" : "homicide" //bestCrime[0]
    ns.singularity.commitCrime(currentCrime);
    ns.print(
      `Crime: ${ currentCrime } Risk Value: ${ ns.getCrimeChance(currentCrime).toPrecision(3) } Cash to Earn: ${ ns.nFormat(ns
        .getCrimeStats(currentCrime)
        .money.toPrecision(4), "$0.0a") }`
    );
    i++;
  }
}
