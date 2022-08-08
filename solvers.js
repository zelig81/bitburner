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
    let isExactChunk = notParsed.match(/^[1-9].+/)
    let isReferenceChunk = notParsed.match(/^[1-9]{2}(\d|$)/)
    let isCopiedAsIs = notParsed.match(/^[^\d]+/)
    let numberOfChars = parseInt(notParsed.substring(0, 1))
    if (isReferenceChunk) {
      let numberCharsToCopy = parseInt(notParsed.substring(1, 2))
      let copiedChars = output.substring(output.length - numberCharsToCopy)
      output += copiedChars.repeat(numberOfChars / numberCharsToCopy) + copiedChars.substring(0, numberOfChars % numberCharsToCopy)
      chunks.push(notParsed.substring(0, 2))
      notParsed = notParsed.substring(2)
    } else if (isExactChunk && notParsed.length > numberOfChars) {
      output += notParsed.substring(1, numberOfChars + 1)
      chunks.push(notParsed.substring(0, numberOfChars + 1))
      notParsed = notParsed.substring(numberOfChars + 1)
    } else if (numberOfChars === 0) {
      chunks.push(notParsed.substring(0, 1))
      notParsed = notParsed.substring(1)
    } else if (isCopiedAsIs) {
      let toBeCopiedAsIs = isCopiedAsIs[0]
      output += toBeCopiedAsIs
      chunks.push(notParsed.substring(0, toBeCopiedAsIs.length))
      notParsed = notParsed.substring(toBeCopiedAsIs.length)
    } else {
      return notParsed
    }
    i++
  }
  console.log(`${data}:\n\tchunks: ${chunks}`)
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
