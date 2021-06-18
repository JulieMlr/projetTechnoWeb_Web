const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UtilisateurSchema = new schema({
    nom: { type : String},
    prenom: { type : String},
    motDePasse: { type: String},
    email: { type: String},
    dateDeNaissance: { type : Date},
    taille: { type: Number},
    poids: { type: Number},
    sexe: { type: String},
    photo : { type: String},
    tableauCourse : [String],
})

module.exports = mongoose.model("utilisateur", UtilisateurSchema);