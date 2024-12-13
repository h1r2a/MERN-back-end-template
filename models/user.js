const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
// Récupérer les rôles autorisés depuis l'environnement
const allowedRoles = process.env.ALLOWED_ROLES.split(',');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: allowedRoles, 
    default: 'User' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
