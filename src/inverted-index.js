import CreateIndexValidator from './create-index-validator';

/** InvertedIndex is a class representing a computer science concept
 *  where the content of a file in mapped to it's position in data base
 *  Or in this case, a JSON array.
 */
export default class InvertedIndex {
  /**
   * Initializes needed variables
   */
  constructor() {
    this.index = {};
    /** @private */
    this.file = {};
  }
  /** @returns {object} books- the file content read */
  getFileContent() {
    return this.file;
  }
  /**
   * @description It checks makes sure any file being uploaded is in good shape.
   * This method is used by readFile(_);
   * @returns {string|boolean} True when file if in good shape|Error string if not
   * @param {string} fileName - Represents the name of the file being processed
   * @param {object} fileContent - Represents the content of the file being passed in.
    */
  isFileValid(fileName, fileContent) {
    this.validity = true;
    let error = CreateIndexValidator.checkFileName(fileName);
    if (error) {
      this.validity = error;
      return this.validity;
    }

    error = CreateIndexValidator.checkFileContent(fileContent);
    if (error) {
      this.validity = error;
      return this.validity;
    }

    return this.validity;
  }
  /**
   * @description This method uses isFileValid() method to validate file
   * before reading book
   * @returns {object} object containing an error message if
   * an error occurs while reading file and  file content
   * @param {string} fileName - Represents the name of the file being read
   * @param {object} fileContent - Represents the content of the file
   */
  readFile(fileName, fileContent) {
    const validity = this.isFileValid(fileName, fileContent);
    if (validity === true) {
      this.file = { fileName, fileContent, error: '' };
    } else {
      this.file = { error: validity, fileContent: [], fileName };
    }
    return this.file;
  }

  /**
   * @description This methods takes in file content. It should not be called until
   * a file has been uploeaded successfully
   * @returns {object} An object containing keys and corresponding indexes
   * @param {string} fileName - The name of the source file. Expected to be a
   * JSON file
   * @param {fileContent} fileContent -An array of javascript content
   */
  createIndex(fileName, fileContent) {
    const has = Object.prototype.hasOwnProperty;
    const readError = this.readFile(fileName, fileContent).error;
    const index = {};
    if (readError) { // if file reading took place with error
      return readError;
    }

    const docs = fileContent;
    let docNumber = 0;
    docs.forEach((doc) => {
      // title of the doc and replace extra spaces with a single space
      let title = doc.title.toLowerCase().replace(/\s\s+/g, ' ');
      let text = doc.text.toLowerCase().replace(/\s\s+/g, ' ');

      // turn book content as to an array words
      title = title.split(' ');
      text = text.split(' ');

      // combine both title and text into one array
      const docContent = [...title, ...text];
      docContent.forEach((word) => {
        if (!has.call(index, word)) {
          index[word] = [docNumber];
        } else if (index[word].indexOf(docNumber) < 0) {
          index[word].push(docNumber);
        }
      });

      docNumber += 1;
    });
    this.index[fileName] = index;
    return this.index;
  }
  /**
   * @description This method first flattens nested arrays if provided.
   * it break strings down into an array of words  then searches for each
   * words in  the array. Then returns a map of each word and it occurrence.
   * @param {object} index - The index to search
   * @param {string} fileName - String representing fileName
   * @param {string|array} terms - An array or string containing
   * search terms
   * @returns {object} - An containing keys and position in the file
   */
  searchIndex(index, fileName, ...terms) {
    const searchResult = {};
    const errorMessage = this.validateSearch(index, fileName, terms);
    if (errorMessage) {
      return errorMessage;
    }
    const searchTerms = InvertedIndex.flattenSearchTerms(terms);
    const indexContent = index[fileName];
    searchTerms.forEach((term) => {
      const occurrence = indexContent[term];
      if (occurrence) {
        searchResult[term] = occurrence;
      } else {
        searchResult[term] = [];
      }
    });
    return searchResult;
  }
  /**
   * @description  This method is used by searchIndex() to flatten the an array of search terms
   * I.e if provided with [1,2,4,[5,6,7],8,9], it should return [1,2,3,4,5,6,7,8,9]
   * @static
   * @param {array} searchTerms - An array of search terms
   * @returns {array} - flattend version of the paramenter
   */
  static flattenSearchTerms(searchTerms = []) {
    const terms = searchTerms;
    let term = ''; // a term in searchTerms
    for (let i = 0; i < terms.length; i += 1) {
      term = terms[i];
      if (Array.isArray(term)) {
        terms.splice(i, 1, ...term); // flatten terms
        i = 0; // step back one step
      } else {
        const strippedString = term.toLowerCase().replace(/\s\s+/g, ' ');
        const splittedString = strippedString.replace(/[^0-9a-z\s]/gi, '').split(' ');
        if (splittedString.length > 1) {
          terms.splice(i, 1, ...splittedString);
          i = 0;
        }
      }
    }
    return terms;
  }
  /**
   * @description This method checks if search can really take place or not
   * For example, a search cannot be created when no inedex has been created.
   * this method is used by searchIndex()
   * @param {object} index - index passed in from searchIndex method
   * @param {string} fileName - name of file being searched
   * @param {array} searchTerms an array of search terms
   * @returns {string} an error if an error occurred or an empty string if not
   */
  validateSearch(index, fileName, searchTerms) {
    const indexIsEmpty = !Object.keys(this.index)[0];
    let errorMessage = '';
    if (!index) {
      errorMessage = 'Please create an index first';
    } else if (typeof index !== 'object') {
      errorMessage = 'The index you provided is invalid';
    } else if (indexIsEmpty) {
      errorMessage = 'Please upload or choose a file first';
    } else if (!fileName) {
      errorMessage = 'Please specify the name of the file you want to process';
    } else if (typeof fileName !== 'string') {
      errorMessage = 'The second argument should be file name';
    } else if (typeof fileName === 'string') {
      const ext = fileName.toLowerCase().split('.').pop();
      if (ext !== 'json') {
        errorMessage = 'The file you\'re tryinig to check should be a json file';
      } else if (!searchTerms || !searchTerms[0]) {
        errorMessage = 'Please provide something to search';
      }
    }
    return errorMessage;
  }
}
