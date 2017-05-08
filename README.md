# inverted-index-api
[![Build Status](https://travis-ci.org/IsaacKay/inverted-index-api.svg?branch=master)](https://travis-ci.org/IsaacKay/inverted-index-api) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/751c6e224ed44d53bf3d295399f33073)](https://www.codacy.com/app/IsaacKay/inverted-index-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IsaacKay/inverted-index-api&amp;utm_campaign=Badge_Grade) [![Coverage Status](https://coveralls.io/repos/github/IsaacKay/inverted-index-api/badge.svg?branch=fixes)](https://coveralls.io/github/IsaacKay/inverted-index-api?branch=fixes)

# fIndex

## Introduction
*  **`fIndex`** is an Express Js Powered Inverted Index Api Demonstrating a simple implementation of the computer science inverted index concept. 
*  It has the following features;
  *  Allows users to;
    *  Create generate index of a json file containing text and title
    *  Search for words in the generated indices
    *  Generate indices for multiple files

### Dev Dependencies

### Dependencies
*  This app's functionality depends on some Node packages including;
  *  **[Express Js](https://www.djangoproject.com/)** - This framework helps is essential in the creation of  object relational models and it also handles routing on the back end.
  * dotenv
  * babel
  * babel-cli
  * gulp-nodemon
  * babel-preset-es2015
  *  body-parser
  * gulp
  * gulp-babel
  * gulp-babel-minify
  * gulp-inject-modules
  * multer


## Installation and setup
*  Navigate to a directory of choice on `terminal`.
*  Clone this repository on that directory.
    >`https://github.com/IsaacKay/inverted-index-api.git`

*  Navigate to the repo's folder on your computer
  *  `cd inverted-index-api/`
*  Install the app's dependencies. For best results, using a node package manager.
  *  `npm install`
*  Navigate to `.example.env` and put the details in there and rename the file to `.env`

    >In order to use app dependencies, you need to install it through **npm**. You also need to have **node** installed on your system.

* Run the app
  *  `npm start`
  *  Running the command above will produce output that's similar to the sample below.

  ```
   [10:36:13] Using gulpfile ~/Desktop/inverted-index-api/gulpfile.babel.js
[10:36:13] Starting 'compile-sources'...
[10:36:14] Finished 'compile-sources' after 1.04 s
[10:36:14] Starting 'serve'...
[10:36:14] Finished 'serve' after 53 ms
[10:36:14] [nodemon] 1.11.0
[10:36:14] [nodemon] to restart at any time, enter `rs`
[10:36:14] [nodemon] watching: /home/fizzy/Desktop/inverted-index-api/src/**/*
[10:36:14] [nodemon] starting `node dist/app.js`
listening on port 4001


  ```
  * Open postman and start using the app `localhost:4001`


