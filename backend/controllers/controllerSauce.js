// importation module 'Sauce'
const modelSauce = require('../models/modelSauce');
// import module 'fs' (gestion des fichier)
const fs = require('fs');


// creation sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // delete sauceObject._id;
    // création d'un nouveau sauce
    const sauce = new modelSauce({
        ...sauceObject,
        // on va générer l'URL de l'image, en implementant la récupération de manier
        // dynamique des segents necessaires de URL ou se trouve notre image         
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({error: error}));    
};

// modification sauce
exports.modifySauce = (req, res, next) => {
    // on test si on a une nouvelle img ou pas
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        // générer la nouvelle image
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    } : {...req.body};
    
    if(sauceObject.imageUrl == null) {
        modelSauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: "Sauce modifié !"}))
        .catch(error => res.status(400).json({error}));

    } else {
        modelSauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];

            fs.unlink(`images/${filename}`, () => {
                modelSauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Image sauce supprimé' }))
                .catch(error => res.status(400).json({ error }));
            });
        });
    } 
};

// suppression sauce
exports.deleteSauce = (req, res, next) => {
    // 1. On va chercher le sauce avec son ID dans BD pour le comparer
    modelSauce.findOne({_id:req.params.id})
    .then(sauce => {
        // si le sauce n'existe pas
        // if(!sauce) {
        //     return res.status(404).json({error: new Error('Sauce non trouvé !')});
        // }
        // //test si ojet 'sauce' appartient au utilisateur qui veut le supprimer
        // if(sauce.userId !== req.auth.userId) {
        //     return res.status(401).json({error: new Error('Requête non autorisée !')}); 
        // }

        //on extrait le nom du fichier a supprimer
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            // test ok => suppression d'objet 'sauce' 
            modelSauce.deleteOne({_id:req.params.id})
            .then(() => res.status(200).json({message: "Sauce supprimé !"}))
            .catch(error => res.status(400).json({error}));
        });    
    })
    .catch(error => res.status(500).json({error}));
};

// récupération d'un seul sauce
exports.getOneSauce = (req, res, next) => {
    modelSauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

// récupération de la totalite des sauces depuis BD
exports.getAllSauce = (req, res, next) => {
    // récupération des tous les sauces
    modelSauce.find()
    .then(infosSauces => res.status(200).json(infosSauces))
    .catch(error => res.status(400).json({error: error}));
};

//Evaluation d'un sauce
exports.evaluerSauce = (req, res, next) => {
   // console.log("Je suis dans la function 'like'");
  
    modelSauce.findOne({_id: req.params.id})
    .then((objet) => {

        // like = 1 (likes = +1)      
        if(!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
          //mise a jour objet dans MongoBD 
            modelSauce.updateOne({_id: req.params.id},
                {                             
                    $inc: {likes: 1}, 
                    $push: {usersLiked: req.body.userId},                    
                }
            )
            .then(() => res.status(201).json({message: 'Like rajouté !'}))
            .catch(error => res.status(400).json({error}));
        };

        // like = 0 (likes=0; pas d'evaluation)
        if(objet.usersLiked.includes(req.body.userId) && req.body.like === 0) {
            //mise a jour objet dans MongoBD 
            modelSauce.updateOne({_id: req.params.id},
                {                             
                    $inc: {likes: -1},  
                    $pull: {usersLiked: req.body.userId},                
                }
            )
            .then(() => res.status(201).json({message: 'Like enlevé !'}))
            .catch(error => res.status(400).json({error}));
        };

        // like = -1 (dislakes = +1)
        if(!objet.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
            //mise a jour objet dans MongoBD 
            modelSauce.updateOne({_id: req.params.id},
                {                             
                    $inc: {dislikes: 1}, 
                    $push: {usersDisliked: req.body.userId},                     
                }
            )
            .then(() => res.status(201).json({message: "Dislike rajouté !"}))
            .catch(error => res.status(400).json({error}));
        }

        // Apres un 'like = -1' on met un 'like= 0' (likes= 0 , pas de vote, on enleve le dislake)
        if(objet.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
            //mise a jour objet dans MongoBD 
            modelSauce.updateOne({_id: req.params.id},
                {                             
                    $inc: {dislikes: -1}, 
                    $pull: {usersDisliked: req.body.userId},                   
                }
            )
            .then(() => res.status(201).json({message: "Pas d'evaluation!"}))
            .catch(error => res.status(400).json({error}));
        };
    })
    .catch(error => res.status(404).json({ error }));  
};


