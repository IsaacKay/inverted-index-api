/* eslint no-undef: 0 */
// require sample files
const emptyJSONFile = require('../fixures/emptyJSONFile.json'),
  validJSONFile = require('../fixures/validFile.json'),
  invalidJSONFile = require('../fixures/invalidJSONFile.json'),
  InvertedIndex = require('../src/inverted-index.js').InvertedIndex;

const invertedIndex = new InvertedIndex();


describe('InvertedIndex', () => {
  // this suit makes sure that Inverted index contains the required class
  describe('Correctness of InvatedIndexClass', () => {
    it('Should be defined when instantiated', () => {
      expect(invertedIndex).toBeDefined();
    });

    it('Should contain isFileValid Method', () => {
      expect(invertedIndex.isFileValid).toBeDefined();
    });

    it('Should contain readFile method', () => {
      expect(invertedIndex.readFile).toBeDefined();
    });

    it('Should contain search method', () => {
      expect(invertedIndex.search).toBeDefined();
    });
  });

  // this suit ensures that isFileValid works for as many input as possible
  describe('InvertedIndex.isFileValid', () => {
    it('Should return \'Invalid File: File must be a real JSON file\' when no argument is passed', () => {
      expect(invertedIndex.isFileValid()).toEqual('Invalid File: File must be a real JSON file');
    });

    it('Should return \'Invalid File: File must be a real JSON file\' when null is passed as argument', () => {
      expect(invertedIndex.isFileValid(null)).toEqual('Invalid File: File must be a real JSON file');
    });

    it('Should return \'Invalid File: File must be a real JSON file\' when boolean is passed as argument', () => {
      expect(invertedIndex.isFileValid(true)).toEqual('Invalid File: File must be a real JSON file');
    });

    it('Should return \'Invalid File: File must be a real JSON file\' when boolean argument is passed', () => {
      expect(invertedIndex.isFileValid(false)).toEqual('Invalid File: File must be a real JSON file');
    });

    it('Should return \'true\' when a valid argument is passed as', () => {
      expect(invertedIndex.isFileValid(validJSONFile)).toBeTrue();
    });

    it('Should return \'Empty File: The JSON File must not be empty\' an empty JSON file is passed', () => {
      expect(invertedIndex.isFileValid(emptyJSONFile).toEqual('Empty File: The JSON File must not be empty'));
    });

    it('Should return \'Invalid File: The JSON File is not in correct form\' when an Invalid json file is passed', () => {
      expect(invertedIndex.isFileValid(invalidJSONFile)).toEqual('Invalid File: JSON file Does not contain valid JSON object');
    });

    it('Should return \'Malformed File: It the JSON file you passed in is out of shape. Please check again\' when a malformed File is passed', () => {
      const malformedJSONFile = fs.readFileSync('../fixures/malformedJSONFile.json').toString();
      expect(invertedIndex.isFileValid(malformedJSONFile)).toString();
    });
  });

  // this suit decribes method
  describe('InvertedIndex.readFile', () => {
    it('Should be a function', () => {
      expect(typeof (invertedIndex.readFile)).toBe('function');
    });

    it('Should return \'returned object should be equal to the internal file object\' when read is successful', () => {
      const readResult = invertedIndex.readFile(validJSONFile);
      const fileContent = invertedIndex.getFile();
      expect(readResult).toEqual(fileContent);
    });

    it('Should return an error message when passed with an invalid file', () => {
      const readResult = invertedIndex.readFile(emptyJSONFile);
      expect(typeof readResult).toBe('string');
    });
  });
});

// this suit contains unit tests for createIndex method
describe('InvertedIndex.createIndex', () => {
  it('Should return an index when provided with valid filename and argument', () => {
    const expectedIndex = {
      an: [0],
      inquiry: [0],
      the: [0, 1],
      string: [0, 1],
      third: [1],
      world: [1],
      from: [1]
    };

    expect(invertedIndex.createIndex('validJSONFile', validJSONFile)).toEqual(expectedIndex);
  });
});
