const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');

const Administrateur = require('../models/Administrateurs');
const Utilisateur = require('../models/Utilisateurs');
const Course = require('../models/Courses');

/*Page Accueil */ 
router.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/accueil.html'));
});

/* Pour supprimer un Utilisateur */
router.get('/delete/:_idAdmin/:_id', (req, res) => {
  const { _id } = req.params;
  const { _idAdmin } = req.params;
  Utilisateur.findOneAndDelete({ _id: _id })
    .then((administrateurs) => {
      Course.deleteMany({idRunner: _id})
      .then((courses)=> console.log("courses suprimées"))
      res.redirect('/administrateur/' + _idAdmin)
    })
});

/* Pour afficher les infos d'une course d'un Utilisateur */
router.get('/course/:idCourse/:idAdmin/:idUser', (req, res) => {
  const {idCourse} = req.params;
  const {idUser} = req.params;
  const {idAdmin} = req.params;
  Course.findOne({_id: idCourse}).then((courses) => {
    res.render('pages/courseUser.html', {
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
    res.render('pages/modifierUser.html', {
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
router.get('/inscriptionAdmin/:idsuperAdmin', (req, res) => {
  const { idsuperAdmin } = req.params;
  res.render('pages/inscription.html', {
    idsuperAdmin: idsuperAdmin,
    erreur: ''
  })
});

/* Page connexion Admin */
router.get('/connexionAdmin', (req, res) => {
  res.sendFile(path.resolve('pages/connexion.html'));
});

/* Page mon compte Admin */
router.get('/modifierAdmin/:_id', (req, res) => {
  const { _id } = req.params;
  Administrateur.findOne({ _id: _id }).then((administrateur) => {
    res.render('pages/modifierAdmin.html', {
      idAdmin: _id,
      nom: administrateur.nom,
      prenom: administrateur.prenom,
      email: administrateur.email,
      motDePasse: administrateur.motDePasse,
    });
  });
});

/* Modifier User */
router.post('/put', async (req, res) => {
  const idAdmin = req.body.admin_id;
  const idUser = req.body.user_id;
  const nom = req.body.user_nom;
  const prenom = req.body.user_prenom;
  const email = req.body.user_email;
  const dateDeNaissance = req.body.user_date;
  Utilisateur.findOneAndUpdate(
    {_id: idUser}, 
    {
      $set: {nom: nom,
        prenom: prenom,
        email: email,
        dateDeNaissance: dateDeNaissance
      },
    }).then((utilisateur) => {
      res.redirect('/administrateur/' + idAdmin)
  })
})

/* Modifier Admin (nos informations) */
router.post('/modifierAdmin', async (req, res) => {
  const idAdmin = req.body.admin_id;
  const nom = req.body.user_nom;
  const prenom = req.body.user_prenom;
  const email = req.body.user_email;
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
router.post('/inscriptionAdmin/:idsuperAdmin', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.user_password, salt);
  const {idsuperAdmin} = req.params;
  const nom = req.body.user_name;
  const prenom = req.body.user_surname;
  const motDePasse = hash;
  const email = req.body.user_mail;

  Administrateur.findOne({ email: email })
    .then((administrateur) => {
      res.render('pages/inscription.html', {
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
          res.redirect('/administrateur/' + idsuperAdmin)
        )
        .catch((err) => console.log(err));
    });
});

/* Page Accueil connecté */
router.get('/:_id', (req, res) => {
  const { _id } = req.params;
  const nomUser = []
  const prenomUser = []
  const emailUser = []
  const idUser = []
  Utilisateur.find()
    .then((utilisateurs) => {
      utilisateurs.forEach(element => {
          nomUser.push(element.nom)
          prenomUser.push(element.prenom)
          emailUser.push(element.email)
          idUser.push(element._id)
      })
      Administrateur.findOne({ _id })
        .then((administrateurs) =>
          res.render('pages/accueilConnect.html', {
            id: _id,
            nom: administrateurs.nom,
            prenom: administrateurs.prenom,
            nomUser: nomUser,
            prenomUser:prenomUser,
            emailUser:emailUser,
            idUser:idUser
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
        res.render('pages/connexion.html', {
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
              res.render('pages/connexion.html', {
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
