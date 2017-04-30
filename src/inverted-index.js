/* eslint require-jsdoc: 0*/
class InvertedIndex {
  contructor() {
    this.index = {};
    this.token = '';
    this.books = {};
  }

  getBooks() {
    return this.books;
  }
  isFileValid(books) {
    this.validity = true;
    if (!books || books === true) {
      this.validity = 'Invalid File: File must be a real JSON file';
    } else {
      try {
        const stringifiedBooks = JSON.stringify(books);
        JSON.parse(stringifiedBooks)
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

  readFile(books) {
    const validity = this.isFileValid(books);
    if (validity === true) {
      this.books = { error: '', books };
    } else {
      this.books = { error: validity, books: [] };
    }
    return this.books;
  }

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
}

module.exports = { InvertedIndex };
