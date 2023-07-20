// multerConfig.ts

import multer from 'multer';
import path from 'path';

// Chemin du répertoire où les images seront stockées
const storageDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req : any, file : any, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
