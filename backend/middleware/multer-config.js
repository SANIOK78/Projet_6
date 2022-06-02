// import module multer
const multer = require('multer');

// dictionnaire MIME_TYPEs du fichier
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
};

//réation d'un objet de configuration pour 'multer'
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // On va générer un nouveau nom:
        const name = file.originalname.split(' ').join('_');
        //Application d'une extension au fichier
        const extension = MIME_TYPES[file.mimetype];
        // création du filename en entier
        callback(null, name + Date.now() + '.'+ extension);
    }
}); 

// export multer
module.exports = multer({storage: storage}).single('image');