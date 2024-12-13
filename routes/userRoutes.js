const express = require('express');
const userController = require('../controllers/userController'); // Importation du contrôleur en objet
const authToken = require('../middlewares/authToken');
const router = express.Router();

router.post('/register', userController.registerUser); // Route pour l’inscription
router.post('/login', userController.loginUser); // Route pour l’authentification


router.get('/admin', authToken(['Admin']), (req, res) => {
    res.json({ message: 'Welcome Admin! You have access to this route.' });
  });
  
  // Route protégée pour tous les utilisateurs authentifiés
  router.get('/user', authToken(['Admin', 'User']), (req, res) => {
    res.json({ message: `Welcome ${req.user.username}! You are logged in.` });
  });

module.exports = router;
