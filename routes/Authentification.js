const express = require("express");
const Router = express.Router()
const pool = require("../config/dataBase");

const cors = require("cors");
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser");
const session = require("express-session");  

const bcrypt = require("bcrypt");
const saltRounds = 10;
const fileUpload = require('express-fileupload');
Router.use(fileUpload());
Router.use(cookieParser());
Router.use(bodyParser.urlencoded({ extended: true }));
Router.use(
    session({
      key: "userId", //name of session we gonna create
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 60 * 60 * 24,
      },
    })
  );
  Router.use(express.json());
  Router.use(
      cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      })
    ); 
  
   
//inscription docteur
Router.post("/createdoctor", (req, res) => {
    let photo;
    let photoPath;
    let carte_visite;
    let cvPath;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.'); }
      console.log('req.files.photoReg.name >>>', req.files.photoReg.name);
      console.log('res.data',res.data);
    photo = req.files.photoReg;
    console.log('photo',photo);
    photoPath =   './config/doctors/' + photo.name; 
    photo.mv(photoPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
        carte_visite = req.files.cvReg;
        console.log(carte_visite)
        cvPath =  '/config/doctors/' + carte_visite.name; 
    carte_visite.mv(cvPath, function(err,rows) { 
        if (!err)
        res.send(rows);
    else
        console.log(err);   

    const nom_doc = req.body.nom_doc;
    const prenom_doc = req.body.prenom_doc;
    const adresse_cabinet = req.body.adresse_cabinet;
    const photo = req.files.photoReg.name;
    const carte_visite = req.files.cvReg.name;
    const description = req.body.description;
    const id_ville = req.body.id_ville;
    const num_tel = req.body.num_tel;
    const google_link = req.body.google_link;
    const facebook_link = req.body.facebook_link;
    const twitter_link = req.body.twitter_link;
    const id_spec = req.body.id_spec; 
    const genre = req.body.genre;
    const login = req.body.login;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      pool.query(
        "INSERT INTO `docteur`  (`nom_doc`, `prenom_doc`, `adresse_cabinet`,`photo`,`carte_visite`,`genre`,`num_tel`, `description`, `id_ville`, `google_link`, `facebook_link`, `twitter_link`, `id_spec`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          nom_doc,
          prenom_doc,
          adresse_cabinet,
          photo,
          carte_visite,  
          genre,
          num_tel,
          description,
          id_ville,
          google_link,
          facebook_link,
          twitter_link,
          id_spec, 
        ],
        (err, result) => {
          console.log(result);
          if (result) {
            pool.query(
              "INSERT INTO `user`  (`login`, `password`, `id_docteur`) VALUES (?,?,?)",
              [login, hash, result.insertId],
              (error, rows) => {
                if (!error)
                // res.send(rows);
                console.log("success")
                  
                else
                    console.log("error",error);
                }
            )
          };
        }
      )
     });
  }); 
  });
  });
  
  
  
Router.post("/register", (req, res) => {
  console.log(req.body)
  const num_tel = req.body.num_tel;
  const nom_p = req.body.nom_p;
  const prenom_p = req.body.prenom_p;
  const date_naissance = req.body.date_naissance;
  const sexe = req.body.sexe;
  const adresse = req.body.adresse;
  const cin = req.body.cin;
  const login = req.body.login;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    pool.query(
      "INSERT INTO patient (num_tel, nom_p, prenom_p, date_naissance, sexe, adresse, cin) VALUES (?,?,?,?,?,?,?)",
      [num_tel, nom_p, prenom_p, date_naissance, sexe, adresse, cin],
      (err, result) => {
        console.log(result);
        if (result) {
          pool.query(
            "INSERT INTO user(login, password, id_patient) VALUES (?,?,?)",
            [login, hash, result.insertId],
            (err, rows) => {
              if (!err)
              res.send({status:true});
            
          else
              console.log("eerror",err);
          }
          );
        }
      }
    );
  });
});

Router.post("/login", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  pool.query(
    "SELECT * FROM `user` WHERE `login` = ? ",
    login,
    (err, result) => {
      console.log(result);
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            console.log("bienvenue");
            res.send("bienvenue");
          } else {
            res.send({ message: "Mot de passe incorrecte " });
          }
        });
      } else {
        res.send({ message: "Merci de verifier votre addresse email" });
      }
    }
  );
});
Router.post("/logindoctor", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  pool.query(
    "SELECT * FROM `user` WHERE `login` = ? AND `id_docteur`> 0",
    login,
    (err, result) => {
      console.log(result);
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            console.log("bienvenue");
            res.send("bienvenue");
          } else {
            res.send({ message: "Mot de passe incorrecte " });
          }
        });
      } else {
        res.send({ message: "Merci de verifier votre addresse email" });
      }
    }
  );
});


Router.post("/rdv", (req, res) => {
  console.log(req.body);
  const jour = req.body.jour;
  const id_temps = req.body.id_temps;
  const num_tel = req.body.num_tel;
  const nom_p = req.body.nom_p;
  const prenom_p = req.body.prenom_p;
  const date_naissance = req.body.date_naissance;
  const sexe = req.body.sexe;
  const adresse = req.body.adresse;
  const cin = req.body.cin;
  const login = req.body.login;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    
    pool.query(      
        "INSERT INTO jour (jour,id_temps) VALUES (?,?)",
        [jour,id_temps],
        (err, result) => {
          console.log(result);
          if (result) {
    pool.query(
      "INSERT INTO rendezvous (id_jour) VALUES (?)",
      [result.insertId], 
      (err, result) => {
        console.log(result);
        if (result) {
          pool.query(
            "INSERT INTO patient (num_tel, nom_p, prenom_p, date_naissance, sexe, adresse, cin, id_rv) VALUES (?,?,?,?,?,?,?,?)",
            [
              num_tel,
              nom_p,
              prenom_p,
              date_naissance,
              sexe,
              adresse,
              cin,
              result.insertId,
            ],
            (err, result) => {
              console.log(result);
              if (result) {
                pool.query(
                  "INSERT INTO user(login, password, id_patient) VALUES (?,?,?)",
                  [login, hash, result.insertId],
                  (err, rows) => {
                    if (!err) res.send({ status: true });
                    else console.log("error", err);
                  }
                );
              }
            }
          );
        }
      }
    );
}
}
);

  });
});
Router.get("/rdvpatient", (req, res) => {
  pool.query(
    "SELECT rendezvous.`id_rv`, rendezvous.`id_consult`, rendezvous.`id_patient`, rendezvous.`id_temps`, rendezvous.`id_jour`, jour.id_jour, jour.jour, jour.id_temps, temps_consultation.id_temps, temps_consultation.temps, patient.id_patient, patient.num_tel, patient.nom_p, patient.prenom_p, patient.sexe, patient.date_naissance, patient.adresse, patient.cin, patient.id_rv, user.id_user, user.login, user.password, user.id_patient, user.id_docteur FROM `user`inner JOIN patient ON patient.id_patient=user.id_user inner join rendezvous on rendezvous.id_jour=patient.id_rv INNER JOIN jour ON rendezvous.id_jour=jour.id_jour inner join temps_consultation on jour.id_temps=temps_consultation.id_temps",
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

module.exports = Router;
