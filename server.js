const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(express.json()); // Middleware pour parser les requêtes JSON


app.use('/api/users', userRoutes);







// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// Exemple de route par défaut
app.get('/', (req, res) => {
  res.send('API est fonctionnelle');
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
