const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

// Fonction de génération du CRUD pour un modèle donné
const generateCrud = (modelName) => {
  const modelPath = path.join(__dirname, '../models', `${modelName}.js`);
  
  // Vérifier si le modèle existe
  if (!fs.existsSync(modelPath)) {
    console.log(`Model '${modelName}' does not exist. Please create the model first.`);
    return; // Arrêter l'exécution si le modèle n'existe pas
  }

  // Dossier du modèle CRUD à créer
  const crudDir = path.join(__dirname, '../controllers');
  const routesDir = path.join(__dirname, '../routes');

  // Créer le dossier controllers et routes si nécessaire
  if (!fs.existsSync(crudDir)) {
    fs.mkdirSync(crudDir);
  }

  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir);
  }

  // Créer les fichiers CRUD
  const controllerFile = path.join(crudDir, `${modelName}Controller.js`);
  const routeFile = path.join(routesDir, `${modelName}Routes.js`);
  
  // Utilisation de la première lettre en majuscule pour le nom du modèle
  const modelNameCap = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const controllerContent = `
const ${modelNameCap} = require('../models/${modelName}');
const { validationResult } = require('express-validator');

const ${modelNameCap}Controller = {
  // Fonction de création
  create: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const new${modelNameCap} = new ${modelNameCap}(req.body);
      const saved${modelNameCap} = await new${modelNameCap}.save();
      res.status(201).json({ message: '${modelNameCap} created successfully', data: saved${modelNameCap} });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating ${modelName}', error: error.message });
    }
  },

  // Fonction de récupération d'un élément par ID
  getById: async (req, res) => {
    try {
      const ${modelName} = await ${modelNameCap}.findById(req.params.id);
      if (!${modelName}) {
        return res.status(404).json({ message: '${modelName} not found' });
      }
      res.status(200).json({ message: '${modelName} found successfully', data: ${modelName} });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching ${modelName}', error: error.message });
    }
  },

  // Fonction de récupération de tous les éléments avec pagination et filtrage
  getAll: async (req, res) => {
    const { page = 1, limit = 10, filter = '' } = req.query;

    try {
      const query = filter ? { name: { $regex: filter, $options: 'i' } } : {};
      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const ${modelName}s = await ${modelNameCap}.find(query)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

      const count = await ${modelNameCap}.countDocuments(query);

      res.status(200).json({
        message: 'All ${modelName}s retrieved successfully',
        data: ${modelName}s,
        totalCount: count,
        totalPages: Math.ceil(count / options.limit),
        currentPage: options.page
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching all ${modelName}s', error: error.message });
    }
  },

  // Fonction de mise à jour
  update: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updated${modelNameCap} = await ${modelNameCap}.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated${modelNameCap}) {
        return res.status(404).json({ message: '${modelName} not found' });
      }
      res.status(200).json({ message: '${modelName} updated successfully', data: updated${modelNameCap} });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating ${modelName}', error: error.message });
    }
  },

  // Fonction de suppression
  delete: async (req, res) => {
    try {
      const deleted${modelNameCap} = await ${modelNameCap}.findByIdAndDelete(req.params.id);
      if (!deleted${modelNameCap}) {
        return res.status(404).json({ message: '${modelName} not found' });
      }
      res.status(200).json({ message: '${modelName} deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting ${modelName}', error: error.message });
    }
  }
};

module.exports = ${modelNameCap}Controller;
`;

  const routeContent = `
const express = require('express');
const router = express.Router();
const ${modelNameCap}Controller = require('../controllers/${modelName}Controller');

// Route pour créer un nouvel élément
router.post('/create', ${modelNameCap}Controller.create);

// Route pour récupérer tous les éléments avec pagination et filtrage
router.get('/', ${modelNameCap}Controller.getAll);

// Route pour récupérer un élément par ID
router.get('/:id', ${modelNameCap}Controller.getById);

// Route pour mettre à jour un élément par ID
router.put('/:id', ${modelNameCap}Controller.update);

// Route pour supprimer un élément par ID
router.delete('/:id', ${modelNameCap}Controller.delete);

module.exports = router;
`;

  // Écrire dans les fichiers
  fs.writeFileSync(controllerFile, controllerContent);
  fs.writeFileSync(routeFile, routeContent);

  console.log(`CRUD for model '${modelName}' generated successfully!`);
};

// Demander à l'utilisateur le nom du modèle
inquirer.prompt([{
  type: 'input',
  name: 'modelName',
  message: 'Enter the model name (in lowercase):',
  validate: (input) => {
    if (!input) {
      return 'Model name is required.';
    }
    return true;
  }
}]).then(answers => {
  const { modelName } = answers;
  generateCrud(modelName);
});
