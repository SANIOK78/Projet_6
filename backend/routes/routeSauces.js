// import module 'express'
const express = require("express");
// Creation router avec la méthode Router d'express
const router = express.Router();
// import module controleur Sauce
const saucesCtrl = require("../controllers/controllerSauce");
// import middleware d'authentification
const auth = require('../middleware/auth');
// import module multer
const multer = require('../middleware/multer-config');

//Route permettant la création/enregistrement d'un sauce dans BD
router.post('/', auth, multer, saucesCtrl.createSauce);

// Route gérant les likes
router.post("/:id/like", auth, saucesCtrl.evaluerSauce);

// Route pour modifier/mettre a jour un sauce dans BD
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// Route pour supprimer un sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Route pour récupérer un sauce, grâce a son ID
router.get('/:id', auth, saucesCtrl.getOneSauce);

// Route pour récupérer tous les sauces
router.get('/', auth, saucesCtrl.getAllSauce);

// exportation du routeur
module.exports = router;