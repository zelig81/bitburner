/** @param {NS} ns **/
export async function main(ns) {
  let listAug = [
    [
      //   "Neuralstimulator", "$9.0b", [
      //     "Aevum"
      //   ]
      // ], [
      // "Neuroreceptor Management Implant", "$1.7b", [
      //   "Tian Di Hui"
      // ]
      // ], [
      //   "The Shadow's Simulacrum", "$1.2b", [
      //     "Speakers for the Dead"
      //   ]
      // ], [
      //   "Power Recirculation Core", "$540.0m", [
      //     "Tetrads"
      //   ]
      // ], [
      //   "CashRoot Starter Kit", "$375.0m", [
      //     "Sector-12"
      //   ]
      // ], [
      "Nanofiber Weave", "$375.0m", [
        "Speakers for the Dead", "Tian Di Hui"
      ]
    ], [
      "Bionic Spine", "$375.0m", [
        "Speakers for the Dead"
      ]
      // ], [
      //   "Cranial Signal Processors - Gen I", "$210.0m", [
      //     "CyberSec"
      //   ]
      // ], [
      //   "Cranial Signal Processors - Gen II", "$375.0m", [
      //     "CyberSec"
      //   ]
    ], [
      "Hacknet Node Core Direct-Neural Interface", "$180.0m", [
        "Netburners"
      ]
      // ], [
      //   "Speech Processor Implant", "$150.0m", [
      //     "Aevum", "Sector-12", "Tian Di Hui"
      //   ]
    ], [
      "HemoRecirculator", "$135.0m", [
        "Tetrads"
      ]
      // ], [
      //   "Augmented Targeting I", "$45.0m", [
      //     "Sector-12", "Slum Snakes"
      //   ]
      // ], [
      //   "Augmented Targeting II", "$127.5m", [
      //     "Sector-12"
      //   ]
    ], [
      "Hacknet Node Kernel Direct-Neural Interface", "$120.0m", [
        "Netburners"
      ]
      // ], [
      //   "LuminCloaking-V1 Skin Implant", "$15.0m", [
      //     "Tetrads", "Slum Snakes"
      //   ]
      // ], [
      //   "LuminCloaking-V2 Skin Implant", "$90.0m", [
      //     "Tetrads", "Slum Snakes"
      //   ]
      // ], [
      //   "Social Negotiation Assistant (S.N.A)", "$90.0m", [
      //     "Tian Di Hui"
      //   ]
      // ], [
      //   "Combat Rib I", "$71.3m", [
      //     "Slum Snakes"
      //   ]
      // ], [
      // "Nuoptimal Nootropic Injector Implant", "$60.0m", [
      //   "Tian Di Hui"
      // ]
      // ], [
      //   "ADR-V1 Pheromone Gene", "$52.5m", [
      //     "Tian Di Hui"
      //   ]
      // ], [
      //   "Speech Enhancement", "$37.5m", [
      //     "Speakers for the Dead", "Tian Di Hui"
      //   ]
    ], [
      "Hacknet Node CPU Architecture Neural-Upload", "$33.0m", [
        "Netburners"
      ]
      // ], [
      //   "BitWire", "$30.0m", [
      //     "CyberSec"
      //   ]
      // ], [
      //   "Synaptic Enhancement Implant", "$22.5m", [
      //     "Aevum", "CyberSec"
      //   ]
    ], [
      "Hacknet Node Cache Architecture Neural-Upload", "$16.5m", [
        "Netburners"
      ]
    ], [
      "Hacknet Node NIC Architecture Neural-Upload", "$13.5m", [
        "Netburners"
      ]
      // ], [
      //   "Neurotrainer I", "$12.0m", [
      //     "Aevum", "CyberSec"
      //   ]
      // ], [
      //   "Wired Reflexes", "$7.5m", [
      //     "Aevum", "Sector-12", "Speakers for the Dead", "Slum Snakes", "Tian Di Hui"
      //   ]
      // ], [
      //   "NeuroFlux Governor", "$2.3m", [
      //     "Aevum", "Sector-12", "Speakers for the Dead", "Tetrads", "Slum Snakes", "Netburners", "Tian Di Hui", "CyberSec"
      //   ]
    ], [
      "SoA - phyzical WKS harmonizer", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Might of Ares", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Wisdom of Athena", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Chaos of Dionysus", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Beauty of Aphrodite", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Trickery of Hermes", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Flood of Poseidon", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Hunt of Artemis", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ], [
      "SoA - Knowledge of Apollo", "$1.0m", [
        "Shadows of Anarchy"
      ]
    ]
  ]
  ns.tail()
  ns.clearLog()
  var augmentationCostMultiplier = 1;
  var overallAugmentationCost = 0;
  for (let augmentation of listAug) {
    let price = ns.singularity.getAugmentationPrice(augmentation[0])
    overallAugmentationCost += price * augmentationCostMultiplier;
    augmentationCostMultiplier *= 1.9;
  }

  ns.print("Augmentation purchase order: " + JSON.stringify(listAug))
  ns.print("Current augmentation purchase cost: " + ns.nFormat(overallAugmentationCost, "$0.0a"));
}
