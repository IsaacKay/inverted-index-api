/**
 * @description -Helper class that helps InvertedIndex.search
 * with validating it's arguments
 */
export default class SearchIndexValidator {
  /**
   * @description - Validates index parameter passed in to inverted index
   * @static
   * @param {object} index - global javascript object
   * @return {string} -empty string if tests passed| error message
   * when tests fail.
   */
  static checkIndex(index) {
    let errorMessage = '';
    if (!index) {
      errorMessage = 'Please create an index first';
    } else if (typeof index !== 'object') {
      errorMessage = 'The index you provided is invalid';
    } else if (typeof index === 'object') {
      const indexIsEmpty = !Object.keys(index);
      if (indexIsEmpty) {
        errorMessage = 'Please upload or choose a file first';
      }
    }
    return errorMessage;
  }
  /**
   * @description -validates filename passed in to search index
   * @static
   * @param {string} fileName the full name of the file. Must be a json file e.g
   * book.json
   * @return {string} empty string when fileName is okay | error message if not
   */
  static checkFileName(fileName) {
    let errorMessage = '';
    if (typeof fileName !== 'string') {
      errorMessage = 'The second argument should be file name';
    } else if (typeof fileName === 'string') {
      const ext = fileName.toLowerCase().split('.').pop();
      if (ext !== 'json') {
        errorMessage = 'The file you\'re tryinig to check should be a json file';
      }
    }
    return errorMessage;
  }
  /**
   * @description - Validates the searchTerms sent to searchIndex method
   * @static
   * @param {Array} searchTerms -An array contain words
   * @return {string} -Empty string when searchTerms are okay|Error message when not
   */
  static checkSearchTerms(searchTerms) {
    let errorMessage = '';
    if (!searchTerms || !searchTerms[0]) {
      errorMessage = 'Please provide something to search';
    }
    return errorMessage;
  }
}
