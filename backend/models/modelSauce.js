// importation 'Mongoose'
const mongoose = require('mongoose');

// Création Schema sauce
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: false, default: 0},
    dislikes: {type: Number, required: false, default: 0},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
});

// Export du model avec le nom 'Sauce'
module.exports = mongoose.model('Sauce', sauceSchema);
