/* eslint no-undef: 0 */
// require sample files
import supertest from 'supertest';
import emptyJSONFile from '../fixures/emptyJSONFile.json';
import validJSONFile from '../fixures/validFile.json';
import validJSONFile2 from '../fixures/validFile2.json';
import malformedJSONFile from '../fixures/malformedJSONFile.json';
import InvertedIndex from '../src/inverted-index';
import app from '../src/app';

const request = supertest(app);
const invertedIndex = new InvertedIndex();
const baseDirectory = process.cwd();
const validJSONFile2Index = {
  'validFile2.json': {
    2: [0, 1],
    22: [1],
    the: [0, 1],
    title: [0, 1],
    of: [0, 1],
    text: [0, 1],
    second: [0, 1],
    file: [0, 1],
    when: [0, 1]
  }
};

const validJSONFileIndex = {
  'validFile.json': {
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
// result when 'this is some crazy search' is searched
const validFileSearchResult = {
  'validFile.json': {
    this: [0, 1],
    is: [1],
    the: [0, 1],
    third: [1],
    world: [1],
    second: [],
    of: [0],
    all: []
  }
};
const validFile2SearchResult = {
  'validFile2.json': {
    this: [],
    is: [],
    the: [0, 1],
    third: [],
    world: [],
    second: [0, 1],
    of: [0, 1],
    all: []
  }
};

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
    expect(invertedIndex.createIndex('validFile.json', validJSONFile)).toEqual(validJSONFileIndex);
  });

  it('Should return an error message when cannot be created for any reason', () => {
    expect(typeof invertedIndex.createIndex('malformedJSONFile.JSON', malformedJSONFile)).toBe('string');
  });
});

describe('InvertedIndex.searchIndex', () => {
  const iIndex = new InvertedIndex();
  iIndex.createIndex('validJSONFile.json', validJSONFile);
  it('Should return \'Please create an index first\' when no argument is passed', () => {
    expect(iIndex.searchIndex()).toBe('Please create an index first');
  });
  it('Should return \'The index you provided is invalid\' when you try to search without uploading or choosing any file', () => {
    const iIndex1 = new InvertedIndex();
    expect(iIndex1.searchIndex('to')).toBe('The index you provided is invalid');
  });
  it('Should return \'The index you provided is invalid\' when the argument passed is not an object', () => {
    expect(iIndex.searchIndex('an')).toEqual('The index you provided is invalid');
  });

  it('Should return search from all indexes when  filename undefine', () => {
    const expectedResult = {
      'validJSONFile.json': {
        this: [0, 1],
        world: [1],
        is: [1],
        wide: [],
        but: [],
        wild: []
      },
      'validFile2.json': {
        this: [],
        world: [],
        is: [],
        wide: [],
        but: [],
        wild: []
      }
    };
    iIndex.createIndex('validFile2.json', validJSONFile2);
    const searchTerms = 'this world is wide but wild';
    expect(iIndex.searchIndex(iIndex.index, undefined, searchTerms)).toEqual(expectedResult);
  });

  it('Should return \'Please provide something to search\' when no search term is passed in', () => {
    expect(iIndex.searchIndex(iIndex.index, 'validJSONFile.JSON')).toBe('Please provide something to search');
  });
});

describe('inverted index api', () => {
  describe('/api/search without index created', (done) => {
    it('Should return an error message when trying to search without creating an index first', (done) => {
      const request2 = supertest(app);
      request2
        .post('/api/search')
        .send(['this is the third world secod of all'])
        .expect('Please create an index. See documentation')
        .expect(200, done);
    });
  });
  describe('/api/create', () => {
    it('should create correct index of the file when valid file is passed in', (done) => {
      request
        .post('/api/create')
        .attach('files', 'fixures/validFile2.json')
        .expect(validJSONFile2Index)
        .expect(200, done);
    });

    it('Should return correct result when requesting multiple files', (done) => {
      const validFileName = Object.keys(validJSONFileIndex).pop();
      const validValue = Object.values(validJSONFileIndex).pop();
      const validFile2Name = Object.keys(validJSONFile2Index).pop();
      const validValue2 = Object.values(validJSONFile2Index).pop();
      const expectedResults = {
        [validFileName]: validValue,
        [validFile2Name]: validValue2
      };
      request
        .post('/api/create')
        .attach('files', `${baseDirectory}/fixures/validFile2.json`)
        .attach('files', `${baseDirectory}/fixures/validFile.json`)
        .expect(expectedResults)
        .expect(200, done);
    });

    it('Should return \'malformed json file\' when a bad json file is uploaded', (done) => {
      request
        .post('/api/create')
        .attach('files', 'fixures/invalidJSONFile.json')
        .expect('malformed json file')
        .expect(200, done);
    });

    it('Should return \'Please provide a second argument (fileContent)\' when empty file is uplaoded', (done) => {
      request
        .post('/api/create')
        .attach('files', `${baseDirectory}/fixures/emptyJSONFile.json`)
        .expect('Please provide a second argument (fileContent)')
        .expect(200, done);
    });
  });

  describe('/api/search', () => {
    it('should return correct index when searching for single file after creating index', (done) => {
      request
        .post('/api/create')
        .attach('files', `${baseDirectory}/fixures/validFile.json`)
        .end(() => {
          request
            .post('/api/search')
            .send({ 'validFile.json': ['this is the third world second of all'] })
            .expect(validFileSearchResult)
            .expect(200, done);
        });
    });
    it('Should should search through all files when search term is not specified', (done) => {
      const validFileName = Object.keys(validFileSearchResult).pop();
      const validFile2Name = Object.keys(validFile2SearchResult).pop();
      const validFileValue = Object.values(validFileSearchResult).pop();
      const validFile2Value = Object.values(validFile2SearchResult).pop();
      const expectedResult = {
        [validFileName]: validFileValue,
        [validFile2Name]: validFile2Value
      };
      request
        .post('/api/search')
        .send(['this is the third world second of all'])
        .expect(expectedResult)
        .expect(200, done);
    });
  });
});
