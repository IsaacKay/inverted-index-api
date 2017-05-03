/* eslint no-undef: 0 */
// require sample files
import fs from 'fs';
import path from 'path';
import emptyJSONFile from '../fixures/emptyJSONFile.json';
import validJSONFile from '../fixures/validFile.json';
import malformedJSONFile from '../fixures/malformedJSONFile.json';
import inIndex from '../src/inverted-index';

const InvertedIndex = inIndex.InvertedIndex;

// cannot require bad json file so i used fs.readFileSync instead
const invalidJSONFile = fs.readFileSync(
  path.join(
    __dirname, '../fixures/invalidJSONFile.json')
  , 'utf-8')
  .toString();
const invertedIndex = new InvertedIndex();


describe('InvertedIndex', () => {
  // this suit makes sure that Inverted index contains the required class
  describe('Correctness of InvertedIndexClass', () => {
    it('Should be defined when instantiated', () => {
      expect(invertedIndex).toBeDefined();
    });

    it('Should contain isFileValid Method', () => {
      expect(invertedIndex.isFileValid).toBeDefined();
    });

    it('Should contain readFile method', () => {
      expect(invertedIndex.readFile).toBeDefined();
    });

    it('Should contain searchIndex method', () => {
      expect(invertedIndex.searchIndex).toBeDefined();
    });

    it('Should contain createIndex method', () => {
      expect(invertedIndex.createIndex).toBeDefined();
    });
  });

  // this suit ensures that isFileValid works for as many input as possible
  describe('InvertedIndex.isFileValid', () => {
    it('Should return \'Please specify a file name\' when no argument is passed', () => {
      expect(invertedIndex.isFileValid()).toBe('Please specify a file name');
    });

    it('Should return \'Please specify a file name\' when null is passed as argument', () => {
      expect(invertedIndex.isFileValid(null)).toBe('Please specify a file name');
    });

    it('Should return \'Please specify a file name\' when boolean is passed as argument', () => {
      expect(invertedIndex.isFileValid(true)).toBe('Please specify a file name');
    });

    it('Should return \'Please specify a file name\' when boolean argument is passed', () => {
      expect(invertedIndex.isFileValid(false)).toBe('Please specify a file name');
    });

    it('Should return \'true\' when a valid argument is passed as', () => {
      expect(invertedIndex.isFileValid('validJSONFile.JSON', validJSONFile)).toBe(true);
    });

    it('Should return \'Empty File: The JSON File must not be empty\' an empty JSON file is passed', () => {
      expect(invertedIndex.isFileValid('emptyJSONFile.JSON', emptyJSONFile)).toBe('Empty File: The JSON File must not be empty');
    });

    it('Should return \'Invalid File: File must be a real JSON file\' when an Invalid json file is passed', () => {
      expect(invertedIndex.isFileValid('invalidJSONFile.JSON', invalidJSONFile)).toBe('Invalid File: File must be a real JSON file');
    });

    it('Should return \'Malformed File: The JSON file you passed in is out of shape. Please check again\' when a malformed File is passed', () => {
      expect(invertedIndex.isFileValid('malformedJSONFile.JSON', malformedJSONFile)).toBe('Malformed File: The JSON file you passed in is out of shape. Please check again');
    });
  });

  // this suit decribes method
  describe('InvertedIndex.readFile', () => {
    it('Should be a function', () => {
      expect(typeof (invertedIndex.readFile)).toBe('function');
    });

    it('Should return \'returned object should be equal to the internal file object\' when read is successful', () => {
      const readResult = invertedIndex.readFile('validJSONFile.JSON', validJSONFile);
      const fileContent = invertedIndex.getFileContent();
      expect(readResult).toEqual(fileContent);
    });

    it('Should return an error message when passed with an invalid file', () => {
      const readResult = invertedIndex.readFile('emptyJSONFile.JSON', emptyJSONFile);
      expect(readResult.error).toBeTruthy();
    });
  });
});

// this suit contains unit tests for createIndex method
describe('InvertedIndex.createIndex', () => {
  it('Should return an index when provided with valid filename as argument', () => {
    const expectedIndex = {
      'validJSONFile.JSON': {
        an: [0],
        inquiry: [0],
        into: [0],
        the: [0, 1],
        wealth: [0],
        of: [0],
        nations: [0],
        this: [0, 1],
        string: [0, 1],
        seeks: [0],
        to: [0, 1],
        help: [0, 1],
        you: [0, 1],
        understand: [0, 1],
        problem: [0, 1],
        set: [0, 1],
        from: [1],
        third: [1],
        world: [1],
        first: [1],
        is: [1],
        also: [1]
      }
    };
    expect(invertedIndex.createIndex('validJSONFile.JSON', validJSONFile)).toEqual(expectedIndex);
  });

  it('Should return an error message when cannot be created for any reason', () => {
    expect(typeof invertedIndex.createIndex('malformedJSONFile.JSON', malformedJSONFile)).toBe('string');
  });
});

describe('InvertedIndex.searchIndex', () => {
  const iIndex = new InvertedIndex();
  iIndex.createIndex(validJSONFile);
  it('Should return \'Please provide something to search\' when no argument is passed', () => {
    expect(iIndex.searchIndex()).toBe('Please create an index first');
  });
  it('Should return \'Please upload or choose a file first\' when you try to search without uploading or choosing any file', () => {
    const iIndex1 = new InvertedIndex();
    expect(iIndex1.searchIndex('to')).toBe('The index you provided is invalid');
  });
  it('Should return correct result when file and index is available', () => {
    expect(iIndex.searchIndex()).toEqual('Please create an index first');
    expect(iIndex.searchIndex('an')).toEqual('The index you provided is invalid');
  });
});
