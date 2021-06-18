const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AdministrateurSchema = new schema({
    nom: { type : String, required: "nom obligatoire"},
    prenom: { type : String, required: "prenom obligatoire"},
    email: { type: String, required: "email obligatoire"},
    motDePasse: { type: String, required: "mot de passe obligatoire"},
})

module.exports = mongoose.model("administrateur", AdministrateurSchema);