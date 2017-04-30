/** InvertedIndex is a class representing a computer science concept
 *  where the content of a file in mapped to it's position in data base
 *  Or in this case, a JSON array.
 */
class InvertedIndex {
  /**
   * Initializes needed variables
   */
  constructor() {
    this.index = {};
    /** @private */
    this.books = {};
  }
  /** @returns {object} books- the file content read */
  getBooks() {
    return this.books;
  }
  /**
   * @description It checks makes sure any file being uploaded is in good shape.
   * This method is used by readFile(_);
   * @returns {string|boolean} True when file if in good shape|Error string if not
   * @param {object|string} books - representing file content or a stringified version
   * of file content.
    */
  isFileValid(books) {
    this.validity = true;
    if (!books || books === true) {
      this.validity = 'Invalid File: File must be a real JSON file';
    } else {
      try {
        const stringifiedBooks = JSON.stringify(books);
        JSON.parse(stringifiedBooks);
        // check if it is an empty stringified JSON object
        if (!stringifiedBooks.replace(/"/g, '')) {
          this.validity = 'Empty File: The JSON File must not be empty';
        } else {
          for (let i = 0; i < books.length; i += 1) {
            const book = books[i];
            // get the number of keys in books
            const keysLength = Object.keys(book).length;

            /* book is malformed if it contains more than 1 key
             * or if it does not cointain the title and text*/
            if (keysLength > 2 || !book.title || !book.text) {
              this.validity = 'Malformed File: The JSON file you passed in is out of shape. Please check again';
              break;
            }
          }
        }
      } catch (error) {
        this.validity = 'Invalid File: JSON file Does not contain valid JSON object';
      }
    }
    return this.validity;
  }
  /**
   * @description This method uses isFileValid() method to validate file
   * before reading book
   * @returns {object} object containing an error message if
   * an error occurs while reading file and  file content
   * @param {string|object} books reperesent file content
   */
  readFile(books) {
    const validity = this.isFileValid(books);
    if (validity === true) {
      this.books = { error: '', books };
    } else {
      this.books = { error: validity, books: [] };
    }
    return this.books;
  }

  /**
   * @description This methods takes in file content. It should not be called until
   * a file has been uploeaded successfully
   * @returns {object} An object containing keys and corresponding indexes
   * @param {object} books - uploaded file content
   */
  createIndex(books) {
    const has = Object.prototype.hasOwnProperty;
    const readError = this.readFile(books).error;
    const index = {};
    if (readError) { // if file reading took place with error
      return readError;
    }
    for (let i = 0; i < books.length; i += 1) {
      const book = books[i];
      // title of the book and replace extra spaces with a single space
      let title = book.title.toLowerCase().replace(/\s\s+/g, ' ');
      let text = book.text.toLowerCase().replace(/\s\s+/g, ' ');

      // turn book content as to an array words
      title = title.split(' ');
      text = text.split(' ');
      const bookContent = [...title, ...text];
      for (let j = 0; j < bookContent.length; j += 1) {
        const word = bookContent[j];
        if (!has.call(index, word)) {
          index[word] = [i];
        } else if (index[word].indexOf(i) < 0) {
          index[word].push(i);
        }
      }
    }
    this.index = index;
    return index;
  }
  /**
   * @description This method first flattens nested arrays if provided.
   * it break strings down into an array of words  then searches for each
   * words in  the array. Then returns a map of each word and it occurrence.
   * @param {string|array} searchTerms - An array or string containing
   * search terms
   * @returns {object} - An containing keys and position in the file
   */
  searchIndex(...searchTerms) {
    const index = this.index;
    const searchResult = {};
    const terms = InvertedIndex.flattenSearchTerms(searchTerms);
    const errorMessage = this.validateSearch(terms);
    if (errorMessage) {
      return errorMessage;
    }
    terms.forEach((term) => {
      const occurrence = index[term];
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
      /* the current term is an array remove it
       * from the array and replace it with it's content
       * instead. then go over the array again.*/
      if (Array.isArray(term)) {
        terms.splice(i, 1, ...term);
        i = 0;
      } else {
        const splittedString = term.toString().replace(/\s\s+/g, ' ').split(' ');
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
   * @param {array} searchTerms an array of search terms
   * @returns {string} an error if an error occurred or an empty string if not
   */
  validateSearch(searchTerms = []) {
    let errorMessage = '';
    if (!searchTerms[0]) {
      errorMessage = 'Please provide something to search';
    } else if (!(this.index)) {
      errorMessage = 'Please upload or choose a file first';
    }
    return errorMessage;
  }
}


module.exports = { InvertedIndex };
