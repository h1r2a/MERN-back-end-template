const express = require('express');
const userController = require('../controllers/userController'); // Importation du contrôleur en objet
const router = express.Router();
router.post('/register', userController.registerUser); // Route pour l’inscription
router.post('/login', userController.loginUser); // Route pour l’authentification
module.exports = router;
