/* eslint no-undef: 0 */
const emptyJSONFile = require('../fixures/emptyJSONFile.json');
const validJSONFile = require('../fixures/validFile.json');
const invalidJSONFile = require('../fixures/invalidJSONFile.json');
const InvertedIndex = require('../src/inverted-index.js').InvertedIndex;

const invertedIndex = new InvertedIndex();

describe('InvertedIndex', () => {
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
});

