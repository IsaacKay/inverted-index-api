/* eslint require-jsdoc: 0*/
class InvertedIndex {
  contructor() {
    this.index = [];
    this.token = '';
  }

  isFileValid(books) {
    this.validity = true;
    if (!books || books === true) {
      this.validity = 'Invalid File: File must be a real JSON file';
    } else {
      try {
        const stringifiedBooks = JSON.stringify(books);
        // check if it is an empty stringified JSON object
        if (!stringifiedBooks.replace(/"/g, '')) {
          this.validity = 'Empty File: The JSON File must not be empty';
        } else {
          for (let i = 0; i < books.length; i += 1) {
            const book = books[i];
            // get the number of keys in books
            const keysLength = Object.keys(book).length;

            /* book is malformed if it contains more than 1 key
             * or if it does not cointain the title and text
             */
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
}

module.exports = { InvertedIndex };
