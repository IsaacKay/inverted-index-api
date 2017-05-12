import CreateIndexValidator from './helpers/create-index-validator';
import SearchIndexValidator from './helpers/search-index-validator';

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
    this.file = {};
    this.searchResult = {};
  }
  /**
   * @description It checks makes sure any file being uploaded is in good shape.
   * This method is used by populateReadResult(_);
   * @returns {string|boolean} True when file if in good shape|Error string if not
   * @param {string} fileName - Represents the name of the file being processed
   * @param {object} fileContent - Represents the content of the file being passed in.
    */
  isFileValid(fileName, fileContent) {
    // todo
    this.isValid = false;
    let error = CreateIndexValidator.checkFileName(fileName);
    if (error) {
      this.isValid = error;
      return this.isValid;
    }
    error = CreateIndexValidator.checkFileContent(fileContent);
    if (error) {
      this.isValid = error;
      return this.isValid;
    }
    this.isValid = true;
    return this.isValid;
  }
  /**
   * @description This method uses isFileValid() method to validate file
   * before reading book
   * @returns {object} object containing an error message if
   * an error occurs while reading file and  file content
   * @param {string} fileName - Represents the name of the file being read
   * @param {object} fileContent - Represents the content of the file
   */
  populateFileReadResult(fileName, fileContent) {
    // validate file first
    const isValid = this.isFileValid(fileName, fileContent);
    if (isValid === true) {
      this.file = { fileName, fileContent, error: '' };
    } else {
      this.file = { error: isValid, fileContent: [], fileName };
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
    const fileReadResult = this.populateFileReadResult(fileName, fileContent);
    const fileReadError = fileReadResult.error;
    const index = {};
    // if file reading took place with error
    if (fileReadError) {
      return fileReadError;
    }
    const docs = fileContent;
    let docNumber = 0;
    docs.forEach((doc) => {
      // title of the doc and replace extra spaces with a single space
      const title = doc.title.toLowerCase().replace(/\s\s+/g, ' ');
      const text = doc.text.toLowerCase().replace(/\s\s+/g, ' ');
      let docContent = `${title} ${text}`;
      docContent = docContent.replace(/[^0-9a-z\s]/gi).split(' ');
      // combine both title and text into one array
      docContent.forEach((word) => {
        // todo
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
  searchIndex(index, fileName = 'all.json', ...terms) {
    // change it to normalize
    const searchTerms = InvertedIndex.normalize(terms);
    const errorMessage = this.validateSearch(index, fileName, searchTerms);
    if (errorMessage) {
      return errorMessage;
    }
    // get search result for  a single file
    if (fileName !== 'all.json') {
      const searchResult = this.doSearch(index, fileName, searchTerms);
      return { [fileName]: searchResult };
    }
    // for all files
    if (fileName === 'all.json') {
      const fileNames = Object.keys(index);
      fileNames.forEach((name) => {
        this.searchResult[name] = this.doSearch(index, name, searchTerms);
      });
      return this.searchResult;
    }
  }
  /**
   * @description - This method contains the logic for the code
   * @param {object} index - An object of generated indices
   * @param {string} fileName - The name of the file to be searched
   * @param {Array} terms - words to be searched
   * @return {object} - Object containing search result
   */
  doSearch(index, fileName, terms) {
    const searchTerms = terms;
    const searchResult = {};
    const errorMessage = this.validateSearch(index, fileName, terms);
    if (errorMessage) {
      return errorMessage;
    }
    const indexContent = index[fileName];
    searchTerms.forEach((term) => {
      const occurrence = indexContent[term];
      if (occurrence && Array.isArray(occurrence) && typeof occurrence[0] === 'number') {
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
  static normalize(searchTerms = []) {
    const terms = searchTerms;
    // a term in searchTerms
    let term = '';
    for (let i = 0; i < terms.length; i += 1) {
      term = terms[i];
      if (Array.isArray(term)) {
        // flatten terms
        terms.splice(i, 1, ...term);
        // start searching again
        i = -1;
      } else {
        // get rid of exptra spaces
        const strippedString = term.toLowerCase().replace(/\s\s+/g, ' ');
        // remove all special characters
        const splittedString = strippedString.toLowerCase().replace(/[^0-9a-z\s]/gi, '').split(' ');

        if (splittedString.length > 1) {
          // faltten and start start searching again
          terms.splice(i, 1, ...splittedString);
          i = -1;
        } else {
          terms[i] = splittedString;
        }
      }
    }
    return terms;
  }
  /**
   * @description This method validates  each parameters sent to check index
   * @param {object} index - index passed in from searchIndex method
   * @param {string} fileName - name of file being searched
   * @param {array} searchTerms an array of search terms
   * @returns {string} an error if an error occurred or an empty string if not
   */
  validateSearch(index, fileName, searchTerms) {
    this.errorMessage = '';
    // check if index is valid
    this.errorMessage = SearchIndexValidator.checkIndex(index);
    if (this.errorMessage) {
      return this.errorMessage;
    }
    // check if fileName is valid
    this.errorMessage = SearchIndexValidator.checkFileName(fileName);
    if (this.errorMessage) {
      return this.errorMessage;
    }
    // check if search terms are valid
    this.errorMessage = SearchIndexValidator.checkSearchTerms(searchTerms);
    if (this.errorMessage) {
      return this.errorMessage;
    }
    // return empty string if no error occured during validation
    return this.errorMessage;
  }
}

