import fs from 'fs';

const filesDir = `${process.cwd()}/dist/uploads/`;
// delete uploads after every 10 mins of last upload
const deleteAllUploads = (index) => {
  setInterval(() => {
    const fileNames = fs.readdirSync(filesDir);
    fileNames.forEach((fileName) => {
      if (fileName) {
        fs.unlinkSync(filesDir + fileName);
      }
    });
    index = undefined;
  }, 50000);
  return index;
};
export default { deleteAllUploads };
