
const product = require('../var');
const multer = require('multer');

function uploadCsv(){

product.fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    }
  });
}

module.exports = uploadCsv;