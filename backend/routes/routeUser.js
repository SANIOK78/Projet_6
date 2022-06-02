// importation express
const express = require('express');
// importation middleware 'password'
const password = require('../middleware/password');
// creation routeur
const router = express.Router();
// import controller associé
const userCtrl = require("../controllers/controllerUser");


// Route permettant l'inscription avec un mot de passe fort
router.post('/signup', password, userCtrl.signup);

// Route permettant la connexion
router.post('/login', userCtrl.login);

// exportation du router
module.exports = router;