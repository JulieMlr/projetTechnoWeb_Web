const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");

const Utilisateur = require("../models/Utilisateurs");

/* Afficher tout les utilisateurs */
router.get("/", (req, res) => {
  Utilisateur.find()
    .then((utilisateurs) => res.send(utilisateurs))
    .catch((err) => console.log(err));
});

/* Ajouter un nouvel utilisateur (inscription) */
router.post("/inscriptionMobile", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.query.motDePasse, salt);
  const nom = req.query.nom;
  const prenom = req.query.prenom;
  const motDePasse = hash;
  const email = req.query.email;
  const dateDeNaissance = req.query.dateDeNaissance;
  const taille = 0;
  const poids = 0;
  const sexe = '';
  const photo = '';
  const tableauCourse = '';
  const newUtilisateur = new Utilisateur({
    nom,
    prenom,
    motDePasse,
    email,
    dateDeNaissance,
    taille,
    poids,
    sexe,
    photo,
    tableauCourse
  });
  newUtilisateur
    .save()
    .then((utilisateurs) => res.send("Utilisateur a bien été crée"))
    .catch((err) => console.log(err));
})

/* Connexion d'un utilisateur */
router.get("/connexionMobile", async (req, res) => {
  const email = req.query.email;
  const motDePasse = req.query.motDePasse;
  Utilisateur.findOne({ email: email })
    .then((utilisateurs) => {
      if (utilisateurs == null) {
        res.status(500).send('Something broke!')
      } else {
        bcrypt.compare(
          motDePasse,
          utilisateurs.motDePasse,
          function (err, response) {
            if (response == true) {
              res.send(utilisateurs);
            } else {
              res.status(500).send('Something broke!')
            }
          }
        );
      }
    })
    .catch((err) => res.send(err));
});

/* Ajouter une course dans le tableauCourse de l'utilisateur */
router.post("/:_id", (req, res) => {
  const { _id } = req.params;
  const addCourseUtilisateur = req.query.course;
  Utilisateur.findOneAndUpdate({ _id }, { $push: {tableauCourse: addCourseUtilisateur} })
    .then((utilisateurs) => res.send("utilisateur Updated"))
    .catch((err) => console.log(err));
});


router.get("/:email", (req, res) => {
  const { email } = req.params;
  Utilisateur.findOne({ email })
    .then((utilisateurs) => res.send(utilisateurs))
    .catch((err) => console.log(err));
});


/* Modifier taille poids sexe d'un utilisateur */
router.put("/:_id", (req, res) => {
  const { _id } = req.params;
  const modifyUser = {
    "taille": req.query.taille,
    "poids": req.query.poids,
    "sexe": req.query.sexe,
    "photo": req.body.photo.uri
  }
  Utilisateur.findOneAndUpdate({ _id }, { $set: modifyUser })
    .then((utilisateurs) => res.send("utilisateur Updated"))
    .catch((err) => console.log(err));
});

/* Mettre à jour le tableauCourse */
router.put("/runTable/:_id", (req, res) => {
  const { _id } = req.params
  const tableauCourse = req.query.courses
  Utilisateur.findOneAndUpdate({ _id }, { $set: { "tableauCourse": tableauCourse } })
    .then((utilisateurs) => res.send("tableau course utilisateur mis à jour"))
    .catch((err) => coonsole.log(err))
})

module.exports = router;
