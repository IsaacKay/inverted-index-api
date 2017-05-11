/**
 * @description - Helps InvertedIndex.createIndex with validataion of
 * parameters passed in.
 * The main purpose of the
 */
export default class CreateIndexValidator {
  /**
   * @description -checks if a file is json. used in checkFile content to
   * check if a file is a valid javascript object
   * @static
   * @param {object} fileContent - javascript global object
   * @return {boolean} - true when argument is javascript global object,
   * false when it is not
   */
  static isJSON(fileContent) {
    let isJSON = true;
    try {
      // ensure that file content is a valid json
      const stringifiedBooks = JSON.stringify(fileContent);
      JSON.parse(stringifiedBooks);
    } catch (error) {
      isJSON = false;
    }
    return isJSON;
  }
  /**
   * @description -Used by InvertedIndex.createIndex to validate fileContent
   * @static
   * @param {object} fileContent  - javascript global object
   * @return {boolean} - true when argument is malformed, false when it is not
   */
  static isMalformed(fileContent) {
    let isMalformed = false;
    try {
      fileContent.forEach((doc) => {
        const keysLength = Object.keys(doc).length;
        // if book contains more than 2 keys or  does not contain requred keys
        if (keysLength > 2 || !doc.title || !doc.text) {
          // break out of the for each
          throw new Error('Malformed File');
        }
      });
    } catch (err) {
      if (err.message.toLowerCase() === 'malformed file') {
        isMalformed = true;
      } else {
        throw err;
      }
    }
    return isMalformed;
  }
  /**
   * @static
   * @description Checks the file name passed to createIndex if it is a json file
   * @param {string} fileName - Name of the json file. Expeted to be the full json file name
   * @return {undefined|string} - Error message when file name is wrong. undefined when fileName is
   * valid
   */
  static checkFileName(fileName) {
    let error; // undefined if no error occurs
    if (!fileName || typeof fileName === 'boolean') {
      error = 'Please specify a file name';
    } else if (typeof fileName !== 'string') {
      this.validity = 'The first argument(fileName) a string';
    } else if (typeof fileName === 'string') {
      const ext = fileName.toLowerCase().split('.').pop();
      if (ext !== 'json') {
        error = 'The file you\'re tryinig to check should be a json file';
      }
    }
    return error;
  }
  /**
   * @static
   * @description Makes sure file content is in right format
   * @param {object} fileContent - a global json object
   * @return {undefined|string} - undefined when fileContent is okay.
   * An error strin when the file is not okay
   */
  static checkFileContent(fileContent) {
    let error;
    let stringifiedDocs;
    if (!fileContent) {
      error = 'Empty JSON file. Please format your json file well';
    } else if (!Array.isArray(fileContent)) {
      error = 'Empty JSON file. Please format your json file well';
    } else if (this.isJSON(fileContent)) {
      stringifiedDocs = JSON.stringify(fileContent);
      if (!stringifiedDocs.replace(/"/g, '')) {
        error = 'Empty File: The JSON File must not be empty';
      } else if (this.isMalformed(fileContent)) {
        error = 'Malformed File: The JSON file you passed in is out of shape. Please check again';
      }
    } else if (!this.isJSON(fileContent)) {
      error = 'Invalid File: JSON file Does not contain valid JSON object';
    }
    return error;
  }
}

