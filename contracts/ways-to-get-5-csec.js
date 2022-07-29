function getCombination(parts, N) {
  var result;
  var parts_normalize = []
  while (N--) parts_normalize.push(parts)
  result = parts_normalize.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
  return result
}

function generateEquations(inputString) {
  var splittedInputString = getSubstrings(inputString);
  var combinations = {}
  for (var len = 1; len <= inputString.length - 1; len++) {
    combinations[len] = getCombination(["-", "+", "*"], len)
  }
  var output = []
  for (let splittedString of splittedInputString) {
    if (splittedString.length > 1) {
      for (let combination of combinations[splittedString.length - 1]) {
        var equation = ""
        for (let i = 0; i < splittedString.length; i++) {
          // if (splittedString[i].length > 1 && splittedString[i].substring(0, 1) != '0') {
          //   equation += splittedString[i] + (i < combination.length ? combination[i] : "")
          // }
        }
        output.push(equation)
      }
    }
  }
  return output
}

function getEquationsEqual(inputString, resultNumber) {
  var equations = generateEquations(inputString);
  var output = []
  for (let equation of equations) {
    var result = parse(equation);
    if (result == resultNumber) {
      output.push(equation)
    }
  }
  return output
}

function splitAllWays(result, left, right) {
  // Push current left + right to the result list
  result.push(left.concat(right));
  //document.write(left.concat(right) + '<br />');

  // If we still have chars to work with in the right side then keep splitting
  if (right.length > 1) {
    // For each combination left/right split call splitAllWays()
    for (var i = 1; i < right.length; i++) {
      splitAllWays(result, left.concat(right.substring(0, i)), right.substring(i));
    }
  }

  // Return result
  return result;
};

function getSubstrings(inputString) {
  var combi = splitAllWays([], [], inputString)
  return combi;
}

function parse(str) {
  return Function(`'use strict'; return (${str})`)()
}

console.log(getEquationsEqual("667440634", 5))
