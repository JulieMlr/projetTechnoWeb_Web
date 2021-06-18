const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");

const Utilisateur = require("../models/Utilisateurs");

router.get("/", (req, res) => {
  Utilisateur.find()
    .then((utilisateurs) => res.render("accueilConnect.html", {nomUser:utilisateurs.nom, prenomUser:utilisateurs.prenom}))
    .catch((err) => console.log(err));
});

router.get("/inscription", (req, res) => {
  res.sendFile(path.resolve("inscription.html"));
});

router.get("/connexion", (req, res) => {
  res.sendFile(path.resolve("connexion.html"));
});

router.post("/inscriptionMobile", async (req, res) => {
  console.log('ici')
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

router.get("/connexionMobile", async (req, res) => {
  const email = req.query.email;
  const motDePasse = req.query.motDePasse;
  console.log(email+' '+motDePasse)
  Utilisateur.findOne({ email: email })
    .then((utilisateurs) => {
      console.log(utilisateurs)
      if (utilisateurs == null) {
        res.status(500).send('Something broke!')
      } else {
        bcrypt.compare(
          motDePasse,
          utilisateurs.motDePasse,
          function (err, response) {
            console.log(utilisateurs)
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

router.post("/information", async (req, res) => {
  const email = req.body.user_mail;
  const motDePasse = req.body.user_password;
  Utilisateur.findOne({ email: email })
    .then((utilisateurs) => {
      if (utilisateurs == null) {
        res.sendFile(path.resolve("connexion.html"));
      } else {
        bcrypt.compare(
          motDePasse,
          utilisateurs.motDePasse,
          function (err, response) {
            if (response == true) {
              res.send("Hello");
            } else {
              res.sendFile(path.resolve("connexion.html"));
            }
          }
        );
      }
    })
    .catch((err) => res.send(err));
});

router.post("/inscription", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.user_password, salt);
  const nom = req.body.user_name;
  const prenom = req.body.user_surname;
  const motDePasse = hash;
  const email = req.body.user_mail;
  const dateDeNaissance = req.body.user_date;
  const taille = req.body.taille;
  const poids = req.body.poids;
  const sexe = req.body.sexe;
  const photo = req.body.photo;
  const tableauCourse = req.body.tableauCourse;



  const newUtilisateur = new Utilisateur({
    nom,
    prenom,
    email,
    motDePasse,
    dateDeNaissance,
    taille,
    poids,
    sexe,
    photo,
    tableauCourse,
    droit,
  });
  newUtilisateur
    .save()
    .then((utilisateurs) => res.send("Utilisateur a bien été crée"))
    .catch((err) => console.log(err));
});

router.post("/:_id", (req, res) => {
  const { _id } = req.params;
  const addCourseUtilisateur = req.query.course;
  console.log(addCourseUtilisateur);
  Utilisateur.findOneAndUpdate({ _id }, { $push: {tableauCourse: addCourseUtilisateur} })
    .then((utilisateurs) => res.send("utilisateur Updated"))
    .catch((err) => console.log(err));
});

/*router.get("/:_id", (req, res) => {
  const { _id } = req.params;
  Utilisateur.findOne({ _id })
    .then((utilisateurs) => res.send(utilisateurs))
    .catch((err) => console.log(err));
});*/

router.get("/:email", (req, res) => {
  const { email } = req.params;
  Utilisateur.findOne({ email })
    .then((utilisateurs) => res.send(utilisateurs))
    .catch((err) => console.log(err));
});

router.put("/:_id", (req, res) => {
  const { _id } = req.params;
  const modifyUser = {
    "taille": req.query.taille,
    "poids": req.query.poids,
    "sexe": req.query.sexe
  }
  Utilisateur.findOneAndUpdate({ _id }, { $set: modifyUser })
    .then((utilisateurs) => res.send("utilisateur Updated"))
    .catch((err) => console.log(err));
});

router.delete("/:_id", (req, res) => {
  const { _id } = req.params;
  Utilisateur.findOneAndDelete({ _id: _id })
    .then((utilisateurs) => res.send("success"))
    .catch((err) => console.log(err));
});

module.exports = router;
