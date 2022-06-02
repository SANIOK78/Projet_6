// importation Express
const express = require('express');
// import 'morgan' (logger http)
const morgan = require('morgan');
// importation connexion a MongoDB
const mongoose = require('./db/db');
// import routeur associé aux sauces
const saucesRoutes = require("./routes/routeSauces");
// impoert routeur associé aux utilisateurs
const userRoutes = require("./routes/routeUser");
// import module 'path' (acces a notre systeme de fichiers)
const path = require('path');

// Création de l'application express
const app = express();
// // logger les requête et les reponse
// app.use(morgan("dev"));

//middleware permettant d'accéder à notre API depuis n'importe quelle origine 
// permet la comunication entre des serveurs différents (locHost:3000 et 4200)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// analyse du corp de la requete
app.use(express.json());
// app.use(bodyParcer.json());

// route fichier static 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utilisation du sauceRoutes
app.use('/api/sauces', saucesRoutes); 

// Utilisation de userRoutes
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Salut Client, ici le Serveur! '});
});

// exportation du app
module.exports = app;