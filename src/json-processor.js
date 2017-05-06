export default class JSONProcessor {

  static process(body, iIndex) {
    const fileNames = Object.keys(body);
    let index;
    fileNames.forEach((fileName) => {
      const fileContent = body[fileName];
      index = iIndex.createIndex(fileName, fileContent);
    });
    return index;
  }
}
