import fs from 'fs';

const filesDir = `${process.cwd()}/uploads/`;
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
  }, 30000);
  return index;
};
export default { deleteAllUploads };
