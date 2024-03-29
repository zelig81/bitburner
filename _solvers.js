export const compressionIRLE = (str) => {
  let output = ""
  let currentLetter = str.substr(0, 1)
  let encounters = 0
  for (let index in str) {
    console.log(`begin: index: ${ index }, letter: ${ str[index] }, currentLetter: ${ currentLetter }, encounters: ${ encounters }, output: ${ output }`)
    if (str[index] == currentLetter && encounters < 9) {
      encounters++;
    } else {
      output += `${ encounters }${ currentLetter }`;
      currentLetter = str[index];
      encounters = 1;
    }
    console.log(`  end: index: ${ index }, letter: ${ str[index] }, currentLetter: ${ currentLetter }, encounters: ${ encounters }, output: ${ output }`)

  }
  output += `${ encounters }${ currentLetter }`;
  return output
}

/**
 * chunk - split array into chunks
 * @param {Array} arr - array
 * @param {Number} size - chunk size
 * @returns {Array} - chunked array
 */
function chunk(arr, size) {
  var chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += size));
  }
  return chunks;
}

export const hammingCodesIntegerToBinary = (data) => {
  /*
  HammingCodes: Integer to Encoded Binary
  You are given the following decimal Value:
  2
  Convert it into a binary string and encode it as a 'Hamming-Code'. eg:
  Value 8 will result into binary '1000', which will be encoded with the pattern 'pppdpddd', where p is a paritybit and d a databit,
  or '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.

  NOTE: You need an parity Bit on Index 0 as an 'overall'-paritybit.
  NOTE 2: You should watch the HammingCode-video from 3Blue1Brown, which explains the 'rule' of encoding, including the first Index parity-bit mentioned on the first note.

  Now the only one rule for this encoding:
  It's not allowed to add additional leading '0's to the binary value
  That means, the binary value has to be encoded as it is
  */
  let numberDecimal = parseInt(data)
  let numberBinary = numberDecimal.toString(2)
  let output = numberBinary;
  let controlBitsIndices = []
  let temp, key, check, arr, j;
  for (let i = 1; numberBinary.length / i >= 1;) {
    controlBitsIndices.push(i);
    i *= 2
  }

  for (j = 0; j < controlBitsIndices.length; j++) {
    key = controlBitsIndices[j];
    arr = output.slice(key - 1).split('');
    temp = chunk(arr, key);
    check = (temp.reduce(function (prev, next, index) {
      if (!(index % 2)) {
        prev = prev.concat(next);
      }
      return prev;
    }, []).reduce(function (prev, next) { return +prev + +next }, 0) % 2) ? 1 : 0;
    output = output.slice(0, key - 1) + check + output.slice(key - 1);
    if (j + 1 === controlBitsIndices.length && output.length / (key * 2) >= 1) {
      controlBitsIndices.push(key * 2);
    }
  }

  return output;
}

export const compressionIILZ = (data) => {
  let output = ""
  let notParsed = data
  let i = 0
  let chunks = []
  while (notParsed.length > 0) {
    if (i > 100) {
      return notParsed
    }
    let numberOfChars = parseInt(notParsed.substring(0, 1))
    let isExactChunk = notParsed.match(`^[1-9].{${ numberOfChars }}([0-9]|$)`)
    let isReferenceChunk = notParsed.match(/^[1-9]{2}0*([1-9].+|$)/)
    if (isReferenceChunk && i != 0) {
      let numberCharsToCopy = parseInt(notParsed.substring(1, 2))
      let copiedChars = output.substring(output.length - numberCharsToCopy)
      output += copiedChars.repeat(numberOfChars / numberCharsToCopy) + copiedChars.substring(0, numberOfChars % numberCharsToCopy)
      chunks.push(notParsed.substring(0, 2))
      notParsed = notParsed.substring(2)
    } else if (isExactChunk) {
      output += notParsed.substring(1, numberOfChars + 1)
      chunks.push(notParsed.substring(0, numberOfChars + 1))
      notParsed = notParsed.substring(numberOfChars + 1)
    } else if (numberOfChars === 0) {
      chunks.push(notParsed.substring(0, 1))
      notParsed = notParsed.substring(1)
    } else {
      console.log(`ERROR: ${ data }:\n\tchunks: ${ chunks }\n\tnotParsed: ${ notParsed }\n\toutput: ${ output }`)
      return ""
    }
    i++
  }
  console.log(`Success: ${ data }:\n\tchunks: ${ chunks }`)
  return output
}

export const compressionIIILZ = (data) => {
  /*
  Compression III: LZ Compression
  Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

  1. Exactly L characters, which are to be copied directly into the uncompressed data.
  2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

  For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

  You are given the following input string:
      eDKeD4vD4vD4vD4bdBCchzBCchzBCczBCczgBCczgBCJe4e4e4e4e4e44444ze4444ze4
      whhhhhhhhhh2ghhhhh2ux8ux8uxe6p6ZeMBp6ZeMBp626ZBpBd1OBd1O2gupq
      gTVrlygTVrly124ERae6r4ERae6rlwnHHHHHHHHHHpUssBeeeeee4Cu4COs
  Encode it using Lempel-Ziv encoding with the minimum possible output length.

  Examples (some have other possible encodings of minimal length):
      abracadabra     ->  7abracad47
      mississippi     ->  4miss433ppi
      aAAaAAaAaAA     ->  3aAA53035
      2718281828      ->  627182844
      abcdefghijk     ->  9abcdefghi02jk
      aaaaaaaaaaaa    ->  3aaa91
      aaaaaaaaaaaaa   ->  1a91031
      aaaaaaaaaaaaaa  ->  1a91041
  */
}

export const arrayJumpingGameII = (arrayData) => {
  /*
  Array Jumping Game II
  You are given the following array of integers:

  2,5,3,4,0,3,4,3,4,5,0,3,5,3,1,1,2,0,0,5,3,1,4,4,2

  Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

  Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach the end of the array.

  If it's impossible to reach the end, then the answer should be 0.
  */
  let jumps = []
  jumps = recursiveArrayJumpingGameII(jumps, "", arrayData)
  // console.log(`made jumps: ${ jumps }`)
  let output = jumps.reduce((accumulator, current) => {
    if (accumulator <= current.length && accumulator > 0) {
      return accumulator
    } else {
      return current.length
    }
  }, 0)
  return output
}

function recursiveArrayJumpingGameII(jumps, currentJump, arrayData) {
  let startIndex = currentJump.split('').reduce((sum, current) => sum + parseInt(current), 0)
  let maxNextJump = parseInt(arrayData[startIndex])
  if (startIndex + maxNextJump >= arrayData.length - 1) { // base case
    let nextJump = arrayData.length - 1 - startIndex
    jumps.push(currentJump + nextJump.toString())
    return jumps
  } else if (maxNextJump === 0) {
    return jumps
  } else {
    for (let i = maxNextJump; i >= 1; i--)
      jumps = recursiveArrayJumpingGameII(jumps, "" + currentJump + i, arrayData)
    return jumps
  }
}

// Sanitize Parentheses in Expression

// method checks if character is parenthesis(open or closed)
function isParenthesis(c) {
  return ((c == '(') || (c == ')'));
}

// method returns true if string contains valid parenthesis
function isValidString(str) {
  let cnt = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '(')
      cnt++;
    else if (str[i] == ')')
      cnt--;
    if (cnt < 0)
      return false;
  }
  return (cnt == 0);
}

// method to remove invalid parenthesis
export const removeInvalidParenthesis = (str) => {
  if (str.length == 0)
    return [];

  // visit set to ignore already visited string
  let visit = new Set();

  // queue to maintain BFS
  let q = [];
  let temp;
  let level = false;
  let solutions = []

  // pushing given string as starting node into queue
  q.push(str);
  visit.add(str);
  while (q.length != 0) {
    str = q.shift();
    if (isValidString(str)) {
      solutions.push(str);

      // If answer is found, make level true
      // so that valid string of only that level
      // are processed.
      level = true;
    }
    if (level)
      continue;
    for (let i = 0; i < str.length; i++) {
      if (!isParenthesis(str[i]))
        continue;

      // Removing parenthesis from str and
      // pushing into queue,if not visited already
      temp = str.substring(0, i) + str.substring(i + 1);
      if (!visit.has(temp)) {
        q.push(temp);
        visit.add(temp);
      }
    }
  }
  if (solutions.length == 0) {
    solutions.push("");
  }
  return solutions;
}

// Total Ways to Sum

export const solverWaysToSum = (arrayData) => {
  var ways = [];
  ways[0] = 1;

  for (var a = 1; a <= arrayData; a++) {
    ways[a] = 0;
  }

  for (var i = 1; i <= arrayData - 1; i++) {
    for (var j = i; j <= arrayData; j++) {
      ways[j] += ways[j - i];
    }
  }

  return ways[arrayData];
}

export const solveComprLZDecode = (compr) => {
  let plain = "";

  for (let i = 0; i < compr.length;) {
    const literal_length = compr.charCodeAt(i) - 0x30;

    if (literal_length < 0 || literal_length > 9 || i + 1 + literal_length > compr.length) {
      return null;
    }

    plain += compr.substring(i + 1, i + 1 + literal_length);
    i += 1 + literal_length;

    if (i >= compr.length) {
      break;
    }
    const backref_length = compr.charCodeAt(i) - 0x30;

    if (backref_length < 0 || backref_length > 9) {
      return null;
    } else if (backref_length === 0) {
      ++i;
    } else {
      if (i + 1 >= compr.length) {
        return null;
      }

      const backref_offset = compr.charCodeAt(i + 1) - 0x30;
      if ((backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) || backref_offset > plain.length) {
        return null;
      }

      for (let j = 0; j < backref_length; ++j) {
        plain += plain[plain.length - backref_offset];
      }

      i += 2;
    }
  }

  return plain;
}

export const solveComprLZEncode = (plain) => {
  // for state[i][j]:
  //      if i is 0, we're adding a literal of length j
  //      else, we're adding a backreference of offset i and length j
  let cur_state = Array.from(Array(10), () => Array(10).fill(null));
  let new_state = Array.from(Array(10), () => Array(10));

  function set(state, i, j, str) {
    const current = state[i][j];
    if (current == null || str.length < current.length) {
      state[i][j] = str;
    } else if (str.length === current.length && Math.random() < 0.5) {
      // if two strings are the same length, pick randomly so that
      // we generate more possible inputs to Compression II
      state[i][j] = str;
    }
  }

  // initial state is a literal of length 1
  cur_state[0][1] = "";

  for (let i = 1; i < plain.length; ++i) {
    for (const row of new_state) {
      row.fill(null);
    }
    const c = plain[i];

    // handle literals
    for (let length = 1; length <= 9; ++length) {
      const string = cur_state[0][length];
      if (string == null) {
        continue;
      }

      if (length < 9) {
        // extend current literal
        set(new_state, 0, length + 1, string);
      } else {
        // start new literal
        set(new_state, 0, 1, string + "9" + plain.substring(i - 9, i) + "0");
      }

      for (let offset = 1; offset <= Math.min(9, i); ++offset) {
        if (plain[i - offset] === c) {
          // start new backreference
          set(new_state, offset, 1, string + String(length) + plain.substring(i - length, i));
        }
      }
    }

    // handle backreferences
    for (let offset = 1; offset <= 9; ++offset) {
      for (let length = 1; length <= 9; ++length) {
        const string = cur_state[offset][length];
        if (string == null) {
          continue;
        }

        if (plain[i - offset] === c) {
          if (length < 9) {
            // extend current backreference
            set(new_state, offset, length + 1, string);
          } else {
            // start new backreference
            set(new_state, offset, 1, string + "9" + String(offset) + "0");
          }
        }

        // start new literal
        set(new_state, 0, 1, string + String(length) + String(offset));

        // end current backreference and start new backreference
        for (let new_offset = 1; new_offset <= Math.min(9, i); ++new_offset) {
          if (plain[i - new_offset] === c) {
            set(new_state, new_offset, 1, string + String(length) + String(offset) + "0");
          }
        }
      }
    }

    const tmp_state = new_state;
    new_state = cur_state;
    cur_state = tmp_state;
  }

  let result = null;

  for (let len = 1; len <= 9; ++len) {
    let string = cur_state[0][len];
    if (string == null) {
      continue;
    }

    string += String(len) + plain.substring(plain.length - len, plain.length);
    if (result == null || string.length < result.length) {
      result = string;
    } else if (string.length == result.length && Math.random() < 0.5) {
      result = string;
    }
  }

  for (let offset = 1; offset <= 9; ++offset) {
    for (let len = 1; len <= 9; ++len) {
      let string = cur_state[offset][len];
      if (string == null) {
        continue;
      }

      string += String(len) + "" + String(offset);
      if (result == null || string.length < result.length) {
        result = string;
      } else if (string.length == result.length && Math.random() < 0.5) {
        result = string;
      }
    }
  }

  return result ?? "";
}

export const solveColoringGraph = (data) => {
  //Helper function to get neighbourhood of a vertex
  function neighbourhood(vertex) {
    const adjLeft = data[1].filter(([a, _]) => a == vertex).map(([_, b]) => b);
    const adjRight = data[1].filter(([_, b]) => b == vertex).map(([a, _]) => a);
    return adjLeft.concat(adjRight);
  }

  //Verify that there is no solution by attempting to create a proper 2-coloring.
  const coloring = Array(data[0]).fill(undefined);
  while (coloring.some((val) => val === undefined)) {
    //Color a vertex in the graph
    const initialVertex = coloring.findIndex((val) => val === undefined);
    coloring[initialVertex] = 0;
    const frontier = [initialVertex];

    //Propogate the coloring throughout the component containing v greedily
    while (frontier.length > 0) {
      const v = frontier.pop() || 0;
      const neighbors = neighbourhood(v);

      //For each vertex u adjacent to v
      for (const id in neighbors) {
        const u = neighbors[id];

        //Set the color of u to the opposite of v's color if it is new,
        //then add u to the frontier to continue the algorithm.
        if (coloring[u] === undefined) {
          if (coloring[v] === 0) coloring[u] = 1;
          else coloring[u] = 0;

          frontier.push(u);
        }

        //Assert u,v do not have the same color
        else if (coloring[u] === coloring[v]) {
          //If u,v do have the same color, no proper 2-coloring exists, meaning
          //the player was correct to say there is no proper 2-coloring of the graph.
          return "[]";
        }
      }
    }
  }
  return coloring;
}

export const solveShortestPathInAGrid = (data) => {
  let H = data.length, W = data[0].length;
  let dist = Array.from(Array(H), () => Array(W).fill(Number.POSITIVE_INFINITY));
  dist[0][0] = 0;

  let queue = [[0, 0]];
  while (queue.length > 0) {
    let [i, j] = queue.shift();
    let d = dist[i][j];

    if (i > 0 && d + 1 < dist[i - 1][j] && data[i - 1][j] !== 1) { dist[i - 1][j] = d + 1; queue.push([i - 1, j]); }
    if (i < H - 1 && d + 1 < dist[i + 1][j] && data[i + 1][j] !== 1) { dist[i + 1][j] = d + 1; queue.push([i + 1, j]); }
    if (j > 0 && d + 1 < dist[i][j - 1] && data[i][j - 1] !== 1) { dist[i][j - 1] = d + 1; queue.push([i, j - 1]); }
    if (j < W - 1 && d + 1 < dist[i][j + 1] && data[i][j + 1] !== 1) { dist[i][j + 1] = d + 1; queue.push([i, j + 1]); }
  }

  let path = "";
  if (Number.isFinite(dist[H - 1][W - 1])) {
    let i = H - 1, j = W - 1;
    while (i !== 0 || j !== 0) {
      let d = dist[i][j];

      let new_i = 0, new_j = 0, dir = "";
      if (i > 0 && dist[i - 1][j] < d) { d = dist[i - 1][j]; new_i = i - 1; new_j = j; dir = "D"; }
      if (i < H - 1 && dist[i + 1][j] < d) { d = dist[i + 1][j]; new_i = i + 1; new_j = j; dir = "U"; }
      if (j > 0 && dist[i][j - 1] < d) { d = dist[i][j - 1]; new_i = i; new_j = j - 1; dir = "R"; }
      if (j < W - 1 && dist[i][j + 1] < d) { d = dist[i][j + 1]; new_i = i; new_j = j + 1; dir = "L"; }

      i = new_i; j = new_j;
      path = dir + path;
    }
  }

  return path;
}

export const solveWaysToSumII = (input) => {
  /**
   *
   * @param {number} target
   * @param {number[]} nums
   * @returns
   */
  let n = input[0];
  let nums = input[1];
  let table = new Array(n + 1);
  for (let i = 0; i < n + 1; i++) {
    table[i] = 0;
  }
  table[0] = 1;

  for (let i of nums) {
    if (i > n) {
      continue;
    }
    for (let j = i; j <= n; j++) {
      table[j] += table[j - i];
    }
    console.log(table);
  }
  return table[n];
}

export function HammingSumOfParity(_lengthOfDBits) { // will calculate the needed amount of parityBits 'without' the "overall"-Parity
  return (_lengthOfDBits < 3 || _lengthOfDBits == 0)
    ? ((_lengthOfDBits == 0) ? 0 : _lengthOfDBits + 1)
    // the Math.log2-math will only work, if the length is greater egqual 3 otherwise it's "kinda broken" :D
    : ((Math.ceil(Math.log2(_lengthOfDBits * 2))) <= Math.ceil(Math.log2(1 + _lengthOfDBits + Math.ceil(Math.log2(_lengthOfDBits)))))
      ? Math.ceil(Math.log2(_lengthOfDBits) + 1)
      : Math.ceil(Math.log2(_lengthOfDBits))
}

export const solveHammingEncode = (value) => {
  let _dataBits = value.toString(2); // change value into string of binary bits
  let _sum_parity = HammingSumOfParity(_dataBits.length); // get the sum of needed parity bits
  let _data = _dataBits.split(""); // create new array with the given data bits
  let _build = []; // init new array for building
  let count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  // count specified data in the array, for later use

  _build.push("x", "x", ..._data.splice(0, 1)); // pre-build the "pre-build"

  for (let i = 2; i < _sum_parity; i++) { // add new paritybits and the corresponding data bits
    _build.push("x", ..._data.splice(0, Math.pow(2, i) - 1))
  }
  // "pre"-build my array, now the "calculation"... get the paritybits working
  for (let index of _build.reduce(function (a, e, i) { if (e == "x") a.push(i); return a; }, [])) {
    let _tempcount = index + 1; // set the "stepsize"
    let _temparray = []; // temporary array to store the corresponding bits
    let _tempdata = [..._build]; // copy the "build"
    while (_tempdata[index] !== undefined) { // as long as there are bits, do "cut"
      let _temp = _tempdata.splice(index, _tempcount * 2); // get x*2 bits, then
      _temparray.push(..._temp.splice(0, _tempcount)); // .. cut them and keep first half
    }
    _temparray.splice(0, 1); // remove first bit, which is the parity one
    _build[index] = ((count(_temparray, "1")) % 2.).toString() // simple count and remainder of 2 with "toString" to store it
  }
  _build.unshift(((count(_build, "1")) % 2.).toString()) // adding first index, which is done as last element
  return _build.join("") // return a string again
}

export const solveHammingDecode = (_data) => {
  let _build = _data.split(""); // ye, an array again
  let _testArray = [];  //for the "tests". if any is false, it is been altered data, will check and fix it later
  let _sum_parity = Math.ceil(Math.log2(_data.length)); // excluding first bit
  let count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0); // count.... again ;)
  let _overallParity = _build.splice(0, 1).join(""); // remove first index, for checking and to use the _build properly later
  _testArray.push((_overallParity == (count(_build, "1") % 2).toString()) ? true : false); // checking the "overall" parity
  for (var i = 0; i < _sum_parity; i++) {
    let _tempIndex = Math.pow(2, i) - 1 // get the parityBits Index
    let _tempStep = _tempIndex + 1 // set the stepsize
    let _tempData = [..._build] // "copy" the build-data
    let _tempArray = [] // init empty array for "testing"
    while (_tempData[_tempIndex] != undefined) { // extract from the copied data until the "starting" index is undefined
      var _temp = [..._tempData.splice(_tempIndex, _tempStep * 2)] // extract 2*stepsize
      _tempArray.push(..._temp.splice(0, _tempStep))  // and cut again for keeping first half
    }
    let _tempParity = _tempArray.shift() // and cut the first index for checking with the rest of the data
    _testArray.push(((_tempParity == (count(_tempArray, "1") % 2).toString())) ? true : false) // is the _tempParity the calculated data?
  }
  let _fixIndex = 0; // init the "fixing" index amd start with -1, bc we already removed the first bit
  for (let i = 1; i < _sum_parity + 1; i++) {
    _fixIndex += (_testArray[i]) ? 0 : (Math.pow(2, i) / 2)
  }
  _build.unshift(_overallParity)
  // fix the actual hammingcode if there is an error
  if (_fixIndex > 0 && _testArray[0] == false) {  // if the overall is false and the sum of calculated values is greater equal 0, fix the corresponding hamming-bit
    _build[_fixIndex] = (_build[_fixIndex] == "0") ? "1" : "0"
  }
  else if (_testArray[0] == false) { // otherwise, if the the overall_parity is only wrong, fix that one
    _overallParity = (_overallParity == "0") ? "1" : "0"
  }
  else if (_testArray[0] == true && _testArray.some((truth) => truth == false)) {
    return 0 // uhm, there's some strange going on... 2 bits are altered? How?
  }
  // oof.. halfway through... we fixed the altered bit, now "extract" the parity from the build and parse the binary data
  for (var i = _sum_parity; i >= 0; i--) { // start from the last parity down the starting one
    _build.splice(Math.pow(2, i), 1)
  }
  _build.splice(0, 1)
  return parseInt(_build.join(""), 2)
}

// Total Ways to Sum II

export const totalWayToSumII = (data, sum) => {
  /*
  Total Ways to Sum II
  How many different distinct ways can the number 59 be written as a sum of integers contained in the set:

  [2,3,4,6,8,9,11,12,13,15,18]?59
  [2,4,5,6,8,9,12,15,20]?
  [2,5,6,7,8,9,10,12]?83

  You may use each integer in the set zero or more times.
  */
  let permutations = []
  for (let i in data) {
    let listOfEncounters = []
    let maxCount = Math.floor(sum / data[i])
    for (let j = 0; j <= maxCount; j++){
      listOfEncounters.push(j) // list of max number of encounters of this number i.e. [[0,1,2,3],[0,1,2],[0,1,2,3,4,5]]
    }
    permutations[i] = listOfEncounters
  }
  console.log(`permutations: ${JSON.stringify(permutations)}`)
  // result is list of exact count of encounters of this number [[0,1,4],....]
  let results = recursiveTotalWayToSumII([], permutations, data, sum)
  return results.length
}

const recursiveTotalWayToSumII = (results, permutations, data, sum) => {
  let newResults = []
  let currentResult = []
  let newPermutations = []
  let currentSum = 0
  for (let i in data) {
    if (permutations[i].length === 1) {
      currentSum += permutations[i][0]
      currentResult.push(permutations[i][0])
      continue
    } else {
      for (let j = 0; j <= permutations[i].length; j++){
        newPermutations[i] = [permutations[i][j]]
        let tmpResults = recursiveTotalWayToSumII(results, newPermutations, data, sum)
        newResults = [...newResults, ...tmpResults]
      }
      return [...results, ...newResults]
    }
  }
  if (currentSum === sum) {
    return [...results, currentResult]
  }
}

// Subarray with Maximum Sum

export const solverLargestSubset = (arrayData) => {
  let highestSubset = arrayData[0];

  for (let i = 0; i < arrayData.length; i++) {

    for (let j = i; j < arrayData.length; j++) {
      let tempSubset = 0;
      for (let k = i; k <= j; k++) {
        tempSubset += arrayData[k];
      }

      if (highestSubset < tempSubset) {
        highestSubset = tempSubset;
      }
    }
  }

  return highestSubset;
}

// Find All Valid Math Expressions

export const solverWaysToExpress = (arrayData) => {
  //ns.tprint("solverWaysToExpress()");
  //await ns.sleep(1000);
  let i, j, k;

  let operatorList = ["", "+", "-", "*"];
  let validExpressions = [];

  let tempPermutations = Math.pow(4, (arrayData[0].length - 1));

  for (i = 0; i < tempPermutations; i++) {

    //if (!Boolean(i % 100000)) {
    //    ns.tprint(i + "/" + tempPermutations + ", " + validExpressions.length + " found.");
    //    await ns.sleep(100);
    //}

    let arraySummands = [];
    let candidateExpression = arrayData[0].substr(0, 1);
    arraySummands[0] = parseInt(arrayData[0].substr(0, 1));

    for (j = 1; j < arrayData[0].length; j++) {
      candidateExpression += operatorList[(i >> ((j - 1) * 2)) % 4] + arrayData[0].substr(j, 1);

      let rollingOperator = operatorList[(i >> ((j - 1) * 2)) % 4];
      let rollingOperand = parseInt(arrayData[0].substr(j, 1));

      switch (rollingOperator) {
        case "":
          rollingOperand = rollingOperand * (arraySummands[arraySummands.length - 1] / Math.abs(arraySummands[arraySummands.length - 1]));
          arraySummands[arraySummands.length - 1] = arraySummands[arraySummands.length - 1] * 10 + rollingOperand;
          break;
        case "+":
          arraySummands[arraySummands.length] = rollingOperand;
          break;
        case "-":
          arraySummands[arraySummands.length] = 0 - rollingOperand;
          break;
        case "*":
          while (j < arrayData[0].length - 1 && ((i >> (j * 2)) % 4) === 0) {
            j += 1;
            candidateExpression += arrayData[0].substr(j, 1);
            rollingOperand = rollingOperand * 10 + parseInt(arrayData[0].substr(j, 1));
          }
          arraySummands[arraySummands.length - 1] = arraySummands[arraySummands.length - 1] * rollingOperand;
          break;
      }
    }

    let rollingTotal = arraySummands.reduce(function (a, b) { return a + b; });

    //if(arrayData[1] == eval(candidateExpression)){
    if (arrayData[1] === rollingTotal) {
      validExpressions[validExpressions.length] = candidateExpression;
    }
  }

  return JSON.stringify(validExpressions);
}

// Array Jumping Game

export const solverArrayJumpingGame = (arrayData) => {
  let arrayJump = [0];

  for (let n = 0; n < arrayData.length; n++) {
    if (arrayJump[n] || !n) {
      for (let p = n; p <= Math.min(n + arrayData[n], arrayData.length - 1); p++) {
        arrayJump[p] = 1;
      }
    }
  }
  //tprint("Array Jumping Game: " + 0 + Boolean(arrayJump[arrayData.length - 1]));
  return 0 + Boolean(arrayJump[arrayData.length - 1]);
}

//ALGORITHMIC STOCK TRADER

export const maxProfit = (arrayData) => {
  let i, j, k;

  let maxTrades = arrayData[0];
  let stockPrices = arrayData[1];

  // WHY?
  let tempStr = "[0";
  for (i = 0; i < stockPrices.length; i++) {
    tempStr += ",0";
  }
  tempStr += "]";
  let tempArr = "[" + tempStr;
  for (i = 0; i < maxTrades - 1; i++) {
    tempArr += "," + tempStr;
  }
  tempArr += "]";

  let highestProfit = JSON.parse(tempArr);

  for (i = 0; i < maxTrades; i++) {
    for (j = 0; j < stockPrices.length; j++) { // Buy / Start
      for (k = j; k < stockPrices.length; k++) { // Sell / End
        if (i > 0 && j > 0 && k > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
        } else if (i > 0 && j > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]);
        } else if (i > 0 && k > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
        } else if (j > 0 && k > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j]);
        } else {
          highestProfit[i][k] = Math.max(highestProfit[i][k], stockPrices[k] - stockPrices[j]);
        }
      }
    }
  }
  return highestProfit[maxTrades - 1][stockPrices.length - 1];
}

const stockMarketProfit = (stocks, maxTransactions = stocks.length - 1) => {
  const n = stocks.length;
  const k = maxTransactions;
  const table = Array.from({ length: k + 1 }, () => Array.from({ length: n + 1 }, () => 0));

  // For each number of transactions.
  for (let t = 1; t <= k; t++) {
    // For each day.
    for (let d = 1; d < n; d++) {
      let max = Number.NEGATIVE_INFINITY;

      // For each day up to this day.
      for (let l = 0; l < d; l++) {
        // Take the current max, or the profit from this sale plus the maximum profit
        // of t-1 transactions up until this point.
        max = Math.max(max, stocks[d] - stocks[l] + table[t - 1][l]);
      }

      // But don't go backward (in case this is a negative transaction).
      table[t][d] = Math.max(max, table[t][d - 1]);
    }
  }

  return table[k][n - 1];
};

//SMALLEST TRIANGLE SUM

export const solveTriangleSum = (arrayData, ns) => {
  let triangle = arrayData;
  let nextArray;
  let previousArray = triangle[0];

  for (let i = 1; i < triangle.length; i++) {
    nextArray = [];
    for (let j = 0; j < triangle[i].length; j++) {
      if (j == 0) {
        nextArray.push(previousArray[j] + triangle[i][j]);
      } else if (j == triangle[i].length - 1) {
        nextArray.push(previousArray[j - 1] + triangle[i][j]);
      } else {
        nextArray.push(Math.min(previousArray[j], previousArray[j - 1]) + triangle[i][j]);
      }

    }

    previousArray = nextArray;
  }

  return Math.min.apply(null, nextArray);
}

//UNIQUE PATHS IN A GRID

export const uniquePathsI = (grid) => {
  const rightMoves = grid[0] - 1;
  const downMoves = grid[1] - 1;

  return Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / (factorial(downMoves)));
}

function factorial(n) {
  return factorialDivision(n, 1);
}

function factorialDivision(n, d) {
  if (n == 0 || n == 1 || n == d)
    return 1;
  return factorialDivision(n - 1, d) * n;
}

export const uniquePathsII = (grid, ignoreFirst = false, ignoreLast = false) => {
  const rightMoves = grid[0].length - 1;
  const downMoves = grid.length - 1;

  let totalPossiblePaths = Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / (factorial(downMoves)));

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {

      if (grid[i][j] == 1 && (!ignoreFirst || (i != 0 || j != 0)) && (!ignoreLast || (i != grid.length - 1 || j != grid[i].length - 1))) {
        const newArray = [];
        for (let k = i; k < grid.length; k++) {
          newArray.push(grid[k].slice(j, grid[i].length));
        }

        let removedPaths = uniquePathsII(newArray, true, ignoreLast);
        removedPaths *= uniquePathsI([i + 1, j + 1]);

        totalPossiblePaths -= removedPaths;
      }
    }

  }

  return totalPossiblePaths;
}

//GENERATE IP ADDRESSES

export const generateIps = (num) => {
  num = num.toString();

  const length = num.length;

  const ips = [];

  for (let i = 1; i < length - 2; i++) {
    for (let j = i + 1; j < length - 1; j++) {
      for (let k = j + 1; k < length; k++) {
        const ip = [
          num.slice(0, i),
          num.slice(i, j),
          num.slice(j, k),
          num.slice(k, num.length)
        ];
        let isValid = true;

        ip.forEach(seg => {
          isValid = isValid && isValidIpSegment(seg);
        });

        if (isValid) ips.push(ip.join("."));

      }

    }
  }

  return ips;

}

function isValidIpSegment(segment) {
  if (segment[0] == "0" && segment !== "0") return false;
  segment = Number(segment);
  if (segment < 0 || segment > 255) return false;
  return true;
}

//GREATEST FACTOR

export const factor = (num) => {
  let listDivisors = []
  let result = num
  for (let div = 2; div <= Math.sqrt(num); div++) {
    while (result % div == 0) {
      listDivisors.push(div)
      if (result / div == 1) {
        break
      } else {
        result = result / div
      }
    }
  }
  console.debug(`factor divisors: ${ listDivisors }`)
  return result;
}

//SPIRALIZE Matrix

export const spiral = (arr, accum = []) => {
  if (arr.length === 0 || arr[0].length === 0) {
    return accum;
  }
  accum = accum.concat(arr.shift());
  if (arr.length === 0 || arr[0].length === 0) {
    return accum;
  }
  accum = accum.concat(column(arr, arr[0].length - 1));
  if (arr.length === 0 || arr[0].length === 0) {
    return accum;
  }
  accum = accum.concat(arr.pop().reverse());
  if (arr.length === 0 || arr[0].length === 0) {
    return accum;
  }
  accum = accum.concat(column(arr, 0).reverse());
  if (arr.length === 0 || arr[0].length === 0) {
    return accum;
  }
  return spiral(arr, accum);
}

function column(arr, index) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    const elm = arr[i].splice(index, 1)[0];
    if (elm) {
      res.push(elm);
    }
  }
  return res;
}

// Merge Overlapping Intervals

export const mergeOverlap = (intervals) => {
  intervals.sort(([minA], [minB]) => minA - minB);
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const [min, max] = intervals[i];
      const [laterMin, laterMax] = intervals[j];
      if (laterMin <= max) {
        const newMax = laterMax > max ? laterMax : max;
        const newInterval = [min, newMax];
        intervals[i] = newInterval;
        intervals.splice(j, 1);
        j = i;
      }
    }
  }
  return intervals;
}

export const proper2ColoringOfGraph = (data) => {
  /*
  Proper 2-Coloring of a Graph
  You are given the following data, representing a graph:
  [9,[[4,7],[5,8],[2,6],[0,4],[4,5],[0,6],[3,7],[7,8],[6,7],[2,4],[5,6]]]
  [6, [[3, 5], [0, 4], [2, 4]]]
  [10,[[0,3],[4,6],[2,8],[1,2],[0,9],[5,7],[4,5],[5,8],[0,7],[0,1],[2,4],[6,9],[1,6],[1,5],[2,9]]]
  Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting. The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between 0 and 8. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter. You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.

  Examples:

  Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
  Output: [0, 0, 1, 1]

  Input: [3, [[0, 1], [0, 2], [1, 2]]]
  Output: []*/
}

export const shortestPathInAGrid = (data) => {

  /*
  Shortest Path in a Grid
  You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


  You are located in the top-left corner of the following grid:

    [[0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0]]

    [[0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,1,0,0],
     [0,0,0,0,0,0,1,1,0],
     [0,0,1,0,0,1,0,1,1],
     [0,1,0,0,0,0,1,0,0],
     [0,0,1,0,0,0,1,0,0],
     [1,0,0,0,0,0,0,0,0],
     [1,0,1,1,0,0,1,0,0]]

  You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

  Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path

  NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
  NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

  Examples:

      [[0,1,0,0,0],
       [0,0,0,1,0]]

  Answer: 'DRRURRD'

      [[0,1],
       [1,0]]

  Answer: ''
  */
}

export const encryptionICaesarCipher = (data) => {
  /*
  Encryption I: Caesar Cipher

  Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

  You are given an array with two elements:
    ["LOGIC VIRUS CLOUD TABLE SHIFT", 20]
  The first element is the plaintext, the second element is the left shift value.

  Return the ciphertext as uppercase string. Spaces remains the same.
  */
  let text = data[0]
  let shift = data[1]
  let output = []
  for (const letterIndex in text) {
    if (text[letterIndex] === ' ') {
      output.push(" ")
    } else {
      output.push(String.fromCharCode(((26 + text[letterIndex].charCodeAt(0) - 'A'.charCodeAt(0)) - shift) % 26 + 'A'.charCodeAt(0)))
    }
  }
  return output.join('')
}

export const encryptionIIVigenereCipher = (data) => {
  /*
  Encryption II: Vigenère Cipher


  Vigenère cipher is a type of polyalphabetic substitution. It uses the Vigenère square to encrypt and decrypt plaintext with a keyword.

    Vignenère square:
          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
        +----------------------------------------------------
      A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
      B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
      C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
      D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
      E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
                  ...
      Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
      Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y

  For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword. For example, the plaintext DASHBOARD is encrypted with the keyword LINUX:
    Plaintext: DASHBOARD
    Keyword:   LINUXLINU
  So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the Vigenère square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.

  You are given an array with two elements:
    ["SHELLMACROINBOXQUEUEARRAY", "GIGABYTE"]
    ["DEBUGCACHEVIRUSTABLEEMAIL", "CLIPBOARD"]
  The first element is the plaintext, the second element is the keyword.

  Return the ciphertext as uppercase string.
  */
  let text = data[0]
  let citherKeyword = data[1]
  let output = []
  for (const letterIndex in text) {
    output.push(String.fromCharCode('A'.charCodeAt(0) + (text[letterIndex].charCodeAt(0) - 2 * 'A'.charCodeAt(0) + citherKeyword[letterIndex % citherKeyword.length].charCodeAt(0)) % 26))
  }
  return output.join('')
}
