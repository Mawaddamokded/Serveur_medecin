const express = require("express");
const Router = express.Router();
const pool = require("../config/dataBase");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
/*  
Router.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
  Router.use(
    cors({
      origin: ["http://localhost:3006"],
      methods: ["GET", "POST"],
      credentials: true,
    })
  ); */  

Router.post("/register", urlencodedParser, (req, res) => {
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
              res.send(rows);
          else
              console.log(err);
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
//inscription docteur
Router.post("/createdoctor", (req) => {
  console.log(JSON.stringify(req))
  const nom_doc = req.body.nom_doc;
  const prenom_doc = req.body.prenom_doc;
  const adresse_cabinet = req.body.adresse_cabinet;
  const photo = req.body.photo;
  const description = req.body.description;
  const id_ville = req.body.id_ville;
  const google_link = req.body.google_link;
  const facebook_link = req.body.facebook_link;
  const twitter_link = req.body.twitter_link;
  const id_spec = req.body.id_spec;
  const login = req.body.login;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    pool.query(
      "INSERT INTO `docteur`  (`nom_doc`, `prenom_doc`, `adresse_cabinet`, `photo`, `description`, `id_ville`, `google_link`, `facebook_link`, `twitter_link`, `id_spec`) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        nom_doc,
        prenom_doc,
        adresse_cabinet,
        photo,
        description,
        id_ville,
        google_link,
        facebook_link,
        twitter_link,
        id_spec,
      ],
      (err, result) => {
        if (result) {
          pool.query(
            "INSERT INTO `user`  (`login`, `password`, `id_docteur`) VALUES (?,?,?)",
            [login, hash, result.insertId],
            (err, res) => {
              console.log("user data", res);
              res.status(200).send("OK");
            }
          );
        }
      }
    );
  });
});


const cookieParser = require("cookie-parser");

const session = require("express-session"); 
Router.use(cookieParser());

/* Router.use(
    session({
      key: "userId", //name of session we gonna create
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 60 * 60 * 24,
      },
    })
  );  */



// inscription patient

module.exports = Router;
