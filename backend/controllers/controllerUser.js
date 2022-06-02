// Import module 'bcrypt'
const bcrypt = require('bcrypt');
// Import module 'jsonwebtoken' (créer et verifier les token)
const jwt = require('jsonwebtoken');

// import model user 
const User = require('../models/modelUser');

// fonction permettant l'inscription des nouveaux utilisateurs
exports.signup = (req, res, next) => {

    // hacher le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {   //récup de hash de mot de pass
        // enregistrement dans le nouveau 'user' qu'on va enregistrer dans BD
        const utilisateur = new User({
            email: req.body.email,
            password: hash
        });
        utilisateur.save()   //enregistrement dans la BD
        .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error})); 
};


// fonction permettant se connecter aux users existants
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        // si l'user non existant
        if(!user) {
            return res.status(401).json({error: 'Utilisateur non trouvé !'})
        }

        // Si user trouvé: comparaison mot de passe entré avec hash  enregistré BD
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {    //récup d'un boolean voir si le test est bon ou pas
            // si test est false
            if(!valid) {
                return res.status(401).json({error: 'Mot de passe incorrect !'})
            }

            // si test est true
            return res.status(200).json({
                userId: user._id,
                token: jwt.sign(     //prend comme argument les données à encoder
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',  // clé secret pour encodaje
                    { expiresIn: '24h'}   //argument de config: token expire en 24h
                )
            });
        })
        .catch(error => res.status(500).json(error));
    })
    // Erreur s'il y a une autre probleme que utilisateur inexistant
    .catch(error => res.status(500).json(error));
};

