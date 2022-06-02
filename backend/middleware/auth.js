// pour verifier les tokens
const jwt = require('jsonwebtoken'); 


// export middleware d'authentification
module.exports = (req, res, next) => {
    try{
        //1. récup du token a partir de la requête
        const token = req.headers.authorization.split(' ')[1];
        //2. decodage du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //3. récup de 'userId' apres le decodage
        const userId = decodedToken.userId;
        // attribution de userId a l'objet requête (mesure de sécurité)
        // req.userId = userId;
        req.auth = {userId: userId};
        //4. s'il y a un userId avec la requête, on va verifier qu'elle 
        // corresponde a celle du token
        if(req.body.userId && req.body.userId !== userId) {

            // on ne va pas authentifier la requête 
            throw 'User ID non valable !';
        } else {
            next();
        }
        
    } catch(error) {
        res.status(401).json({error: error | 'Requête non authentifié !'});
    }
};