/** @param {NS} ns */
export async function main(ns) {
  await ns.wget(`https://api.github.com/repos/zelig81/bitburner/git/trees/main?recursive=1`, `gitFiles.txt`);
  const gitFiles = ns.read(`gitFiles.txt`)
  const result = JSON.parse(gitFiles)
  const files = result["tree"]
  for (let file of files) {
    if (file.path.match(".*\.js") != null) {
      await ns.wget(`https://raw.githubusercontent.com/zelig81/bitburner/main/${file.path}`, file);
      ns.tprint(`file ${file.path} downloaded...`)
    } else {
      ns.tprint(`file ${file.path} is not javascript`)
    }
  }

}
