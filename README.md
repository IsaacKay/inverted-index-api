# inverted-index-api
[![Build Status](https://travis-ci.org/IsaacKay/inverted-index-api.svg?branch=server-side)](https://travis-ci.org/IsaacKay/inverted-index-api) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/751c6e224ed44d53bf3d295399f33073)](https://www.codacy.com/app/IsaacKay/inverted-index-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IsaacKay/inverted-index-api&amp;utm_campaign=Badge_Grade) [![Coverage Status](https://coveralls.io/repos/github/IsaacKay/inverted-index-api/badge.svg?branch=server-side)](https://coveralls.io/github/IsaacKay/inverted-index-api?branch=fixes)

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

## Usage
After starting your server, you are ready to move on. 
There are 2 end points namely:

### Creating index

**index is created from /api/create**
This route can take 2 types of data
1. 	 multipart/form-data request
2. 	 application/json
		
		Also note that whatever you send to this /api/create should be json data in this form
		`{
			"file1.json": [
					{
						"title": "the title of doc 1 in file 1",
						"text": "the text of doc 1in file 1"
					},
				{
					"title": "the title of doc 2 file 1",
					"text": "the text of doc 2 file 1"
				}
			],
		"file2.json": [
			{
				"title": "the title of doc 1 file 2",
				"text": "the text of doc 1 file 2"
			}
		]
	}`

**Example using curl to send application/json content**
	_request_
	> `$ curl -H "Content-Type: application/json" -X POST -d '{"fileName.json": [{"title": "this is the title of the first doc", "text":"this is the text 2"}, {"title": "this is the second doc title", "text": "this is the text of second doc"}]}' http://localhost:3001/api/create`


_response_
> `{"file1.json":{"1":[0,1],"2":[1],"the":[0,1],"title":[0,1],"of":[0,1],"doc":[0,1],"file":[0,1],"text":[0,1],"doc1":[0]}}`
	
_"of":[0,1] means that the word of appears in doc0 and doc1. same principle applies to the rest of the genrated index_

**Example using postman to upload json file**
Uploaded files should look like this
[file example](https://www.dropbox.com/s/rw11lbj830asv4k/file1_json.png?dl=0)

when uploading files, your field name should be files.
_note: while uploading with postman, do not specify any header._
[this](https://www.dropbox.com/s/3620oo387nho2fk/creating_index_from_postman.png?dl=0) is an example of how to create index with postman

### Searching created index
*searching goes through the /api/search route*
Once you create index, your index with that of other users is held on the server for at least 10 minutes. After 10 minutes, you might need to create index again.

This route takes `application/json data ` only.
Search terms must be in this format: `{'fileName.json' : "these are the search terms"}`.
If the file name is not specified i.e like this `["these", "are", "the", "search", "terms"]`, then the api searches through all files that have been created on the server

**Example Of Search Using curl**

_request_

>` curl -H "Content-Type: application/json" -X POST -d '{"file1.json": "these are the search terms"}' http://localhost:3001/api/search`
_response_

> `{"file1.json":{"these":[],"are":[],"the":[0,1],"search":[],"terms":[]}}`

Note: `the:[0,1]` means _the word 'the' is present in doc 1 and doc 2_

**Using  postman to search**
* open a new tab
* set content -type to application/json
* post your search term using the raw field;



