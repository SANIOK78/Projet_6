// importation package permettant d'utiliser variables d'environnement
const dotenv = require('dotenv');
const result = dotenv.config();

// importation 'mongoose' permettant la connexion a BD
const mongoose = require('mongoose');

// connexion a MongoBd
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// export 'mongoose'
module.exports = mongoose;