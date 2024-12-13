const multer = require('multer');
const path = require('path');

// Définir l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront sauvegardés
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Récupérer l'extension du fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Renommer le fichier
  }
});

// Middleware pour l'upload d'un fichier unique
const uploadSingle = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille (5MB)
}).single('file'); // Le nom du champ de formulaire pour le fichier

// Middleware pour l'upload de plusieurs fichiers
const uploadMultiple = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille (5MB)
}).array('files', 5); // Le nom du champ de formulaire pour les fichiers et le nombre maximum de fichiers (5)

module.exports = { uploadSingle, uploadMultiple };
