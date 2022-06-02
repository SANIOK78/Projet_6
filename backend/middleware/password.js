// Importation 'password-validator'
const passwordValidator = require('password-validator');

// Créer un schéma
var passwordSchema = new passwordValidator();

//Le schéma de mot de passe
passwordSchema
.is().min(6)                                       // Longueur minimale 8
.is().max(20)                                     // Longueur maximale 100
.has().uppercase()                                 // Doit contenir des lettres majuscules
.has().lowercase()                                 //  Doit contenir des lettres minuscules
.has().digits(2)                                   //  Doit avoir au moins 2 chiffres
.has().not().spaces()                              // Ne doit pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']);    // Mettre ces valeurs sur liste noire


// console.log(passwordSchema);

// Verification de la complexité du password par raport au schema
module.exports = (req, res, next) => {
    // si le password est bon
    if(passwordSchema.validate(req.body.password)) {
        next();

    } else {
        return res.status(400)
        .json({
            error: `Mot de passe faible : ${passwordSchema.validate('req.body.password', {list:true})}`
        });
       
    }
};


