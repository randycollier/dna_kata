KnownDNAMap = {
    "97": "TGAT",
    "99": "TGAC",
    "116": "TCTA"
  };
  
  DNABase = ["A", "T", "G", "C"];
  
  ComplementaryDNAPairs = [["A", "T"], ["G", "C"]];
  
  class DNA {
    constructor() {}
  
    encodeDNA(asciiString = []) {
      const asciiArray = asciiString.split("");
      if (!this.isValidAsciiArray(asciiArray)) {
        return false;
      }
  
      const base = this.DNABase;
      return asciiArray
        .reduce((acc, char) => {
          const asciiCode = char.charCodeAt(0);
  
          if (KnownDNAMap.hasOwnProperty(asciiCode)) {
            return Object.assign([...acc, KnownDNAMap[asciiCode]]);
          }
  
          return acc;
        }, [])
        .join();
    }
  
    convertDNAtoRNA(KnownDNAMap) {
      let knownRNAMap = Object.assign({ ...KnownDNAMap });
  
      for (let key in KnownDNAMap) {
        knownRNAMap[key] = knownRNAMap[key]
          .split("")
          .map(char => {
            return char === "T" ? "U" : char;
          })
          .join();
      }
      return knownRNAMap;
    }
  
    isValidAsciiArray(asciiArray) {
      return (
        !asciiArray ||
        asciiArray.filter(char => {
          const asciiCode = char.charCodeAt(0);
          return asciiCode > 0 && asciiCode <= 255;
        })
      );
    }
  
    //if none exist, return -1
    hasNonDNABase(dnastring) {
      const re = new RegExp(`[^${DNABase.join("")}]`);
      return dnastring.search(re);
    }
  
    getComplementaryDNA(DNAString) {
      if (this.hasNonDNABase(DNAString) !== -1) {
        return false;
      }
  
      const convertDNA = this.getComplementaryDNADictionary(
        ComplementaryDNAPairs
      );
      let complementaryDNA = Object.assign([...DNAString.split("")]);
  
      return complementaryDNA
        .map(char => {
          const convert = convertDNA(char);
          return convert ? convert : char;
        })
        .join("");
    }
  
    convertDNAtoASCII(dnaString) {
      if (dnaString.length % 4 !== 0) {
        return false;
      }
      const reverseKnownDNAMap = this.getReverseDNAMap(KnownDNAMap);
      let asciiArr = [];
      let index = 0;
      while (index <= dnaString.length - 4) {
        asciiArr.push(dnaString.slice(index, index + 4));
        index += 4;
      }
      return asciiArr
        .map(base => {
          const char = String.fromCharCode(reverseKnownDNAMap(base));
          return char;
        })
        .join("");
    }
  
    getReverseDNAMap(dnaMap) {
      const reverseKnownDnaMap = Object.keys(dnaMap).reduce((acc, key) => {
        acc[dnaMap[key]] = key;
        return acc;
      }, {});
  
      return base => {
        if (reverseKnownDnaMap.hasOwnProperty(base)) {
          return reverseKnownDnaMap[base];
        }
        return false;
      };
    }
  
    getComplementaryDNADictionary(dnaPairs) {
      const pairs = dnaPairs.reduce((acc, arr) => {
        acc[arr[0]] = arr[1];
        acc[arr[1]] = arr[0];
        return acc;
      }, {});
  
      return char => {
        if (pairs.hasOwnProperty(char)) {
          return pairs[char];
        }
        return false;
      };
    }
  }
  
  let dna = new DNA();
  
  // Objective 1: Provide a mechanism to encode arbitrary standard ASCII text strings
  // as DNA. Recall that ASCII characters have numeric values of 0 to 255.
  let encodeDNA = dna.encodeDNA("cat");
  console.log("Objective 1", encodeDNA);
  
  // Objective 2: RNA is very similar to DNA, but it replaces T with U. Make your
  // program capable of encoding as either DNA or RNA.
  let rnaConversion = dna.convertDNAtoRNA(KnownDNAMap);
  console.log("Objective 2", rnaConversion);
  
  // Objective 3: Provide an interface for identifying standard ASCII text substrings
  // encoded as DNA; the interface should provide the zero-based index where the
  // substring begins or -1 if it does not exist.
  let nonDNABase = dna.hasNonDNABase("AXCG");
  console.log("Objective 3", nonDNABase);
  
  // Objective 4: DNA actually consists of two, complementary strands that are
  // attached in such a way that every A matches T and G matches C (and the
  // inverses). Given a complementary strand of DNA, output the ASCII equivalent of
  // the primary strand.
  let complementDNA = dna.getComplementaryDNA("ACTGACTAAGAT");
  let convertDNAtoASCII = dna.convertDNAtoASCII(complementDNA);
  console.log("Objective 4", convertDNAtoASCII);