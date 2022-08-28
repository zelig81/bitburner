export async function main(ns) {
  ns.tprint(JSON.stringify(eval(ns.args[0]), null, 4));
}
