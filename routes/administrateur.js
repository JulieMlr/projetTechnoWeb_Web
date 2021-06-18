const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');

const Administrateur = require('../models/Administrateurs');
const Utilisateur = require('../models/Utilisateurs');
const Course = require('../models/Courses');

/*Page Accueil */ 
router.get('/', (req, res) => {
  res.sendFile(path.resolve('accueil.html'));
});

/* Pour supprimer un Utilisateur */
router.get('/delete/:_idAdmin/:_id', (req, res) => {
  const { _id } = req.params;
  const { _idAdmin } = req.params;
  Utilisateur.findOneAndDelete({ _id: _id })
    .then((administrateurs) => res.redirect('/administrateur/' + _idAdmin))
    .catch((err) => console.log(err));
});

/* Pour afficher les infos d'une course d'un Utilisateur */
router.get('/course/:idCourse/:idAdmin/:idUser', (req, res) => {
  const {idCourse} = req.params;
  const {idUser} = req.params;
  const {idAdmin} = req.params;
  Course.findOne({_id: idCourse}).then((courses) => {
    res.render('courseUser.html', {
      idUser: idUser,
      id: idCourse,
      idAdmin: idAdmin,
      duree: courses.duree,
      date: courses.date,
      kilometres: courses.kilometres,
    });
  });
});

/* Pour modifier un Utilisateur */
router.get('/modifier/:_idAdmin/:_id', (req, res) => {
  const { _id } = req.params;
  const { _idAdmin } = req.params;
  Utilisateur.findOne({ _id: _id }).then((utilisateurs) => {
    res.render('modifierUser.html', {
      idAdmin: _idAdmin,
      id: _id,
      nom: utilisateurs.nom,
      prenom: utilisateurs.prenom,
      email: utilisateurs.email,
      dateDeNaissance: utilisateurs.dateDeNaissance,
      tableauCourse: utilisateurs.tableauCourse,
      motDePasse: utilisateurs.motDePasse,
    });
  });
});

/* Page inscription Admin*/
router.get('/inscriptionAdmin', (req, res) => {
  res.sendFile(path.resolve('inscription.html'));
});

/* Page connexion Admin */
router.get('/connexionAdmin', (req, res) => {
  res.sendFile(path.resolve('connexion.html'));
});

/* Page mon compte Admin */
router.get('/modifierAdmin/:_id', (req, res) => {
  const { _id } = req.params;
  Administrateur.findOne({ _id: _id }).then((administrateur) => {
    res.render('modifierAdmin.html', {
      idAdmin: _id,
      nom: administrateur.nom,
      prenom: administrateur.prenom,
      email: administrateur.email,
      motDePasse: administrateur.motDePasse,
    });
  });
});

/* Modifier Admin (nos informations) */
router.post('/modifierAdmin', async (req, res) => {
  const idAdmin = req.body.admin_id;
  const nom = req.body.user_nom;
  const prenom = req.body.user_prenom;
  const email = req.body.user_email;
  console.log(req.body.user_password)
  if (req.body.user_password == "") {
    Administrateur.findOne({ _id: idAdmin }).then((administrateurAvant) => {
      const motDePasse = administrateurAvant.motDePasse;
      Administrateur.findOneAndUpdate(
        { _id: idAdmin },
        {
          $set: {
            nom: nom,
            prenom: prenom,
            email: email,
            motDePasse: motDePasse,
          },
        }
      )
        .then((administrateur) =>
          res.redirect('/administrateur/' + idAdmin)
        )
        .catch((err) => console.log(err));
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.user_password, salt);
    const motDePasse = hash;
    Administrateur.findOneAndUpdate(
      { _id: idAdmin },
      {
        $set: {
          nom: nom,
          prenom: prenom,
          email: email,
          motDePasse: motDePasse,
        },
      }
    )
      .then((administrateur) =>
        res.redirect('/administrateur/' + idAdmin)
      )
      .catch((err) => console.log(err));
  }
});

/* Inscription Admin */
router.post('/inscriptionAdmin', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.user_password, salt);
  const nom = req.body.user_name;
  const prenom = req.body.user_surname;
  const motDePasse = hash;
  const email = req.body.user_mail;

  Administrateur.findOne({ email: email })
    .then((administrateur) => {
      console.log(administrateur.email)
      res.render('inscription.html', {
        erreur: 'Email deja utilisé',
      })
    })
    .catch((err) => {
      const newAdministrateur = new Administrateur({
        nom,
        prenom,
        email,
        motDePasse,
      });
      newAdministrateur
        .save()
        .then((administrateur) =>
          res.redirect('/administrateur/' + administrateur._id)
        )
        .catch((err) => console.log(err));
    });
});

/* Page Accueil connecté */
router.get('/:_id', (req, res) => {
  const { _id } = req.params;
  Utilisateur.find()
    .then((utilisateurs) => {
      Administrateur.findOne({ _id })
        .then((administrateurs) =>
          res.render('accueilConnect.html', {
            id: _id,
            nom: administrateurs.nom,
            prenom: administrateurs.prenom,
            nomUser: ([] = utilisateurs),
          })
        )
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

/* Connexion Admin */
router.post('/connexion', (req, res) => {
  const email = req.body.user_mail;
  const motDePasse = req.body.user_password;
  Administrateur.findOne({ email: email })
    .then((administrateurs) => {
      if (administrateurs == null) {
        res.render('connexion.html', {
          erreur: 'Email incorrect',
        });
      } else {
        bcrypt.compare(
          motDePasse,
          administrateurs.motDePasse,
          function (err, response) {
            if (response == true) {
              res.redirect('/administrateur/' + administrateurs._id);
            } else {
              res.render('connexion.html', {
                erreur: 'Mot de passe incorrect',
              });
            }
          }
        );
      }
    })
    .catch((err) => res.send(err));
});

module.exports = router;
