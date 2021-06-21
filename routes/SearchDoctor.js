const express = require("express");
const Router = express.Router()
const pool = require("../config/dataBase");
const fileUpload = require('express-fileupload');
const bcrypt = require("bcrypt");
const saltRounds = 10;
Router.use(fileUpload());
Router.post('/upload', (req, res) => {
/*     if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.'); } 
    sampleFile = req.files.sampleFile;
    uploadPath = './config/doctors/' + sampleFile.name;
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
    }) 
    cvFile = req.files.cvFile;
    cvPath = './config/doctors/' + cvFile.name ;
    cvFile.mv(cvPath, function (err) {
        if (err) return res.status(500).send(err);
      }) */
      console.log(req.body)
      const nom_doc = req.body.nom_doc
      const prenom_doc = req.body.prenom_doc
      const adresse_cabinet = req.body.adresse_cabinet
      const description = req.body.description
      const id_ville = req.body.id_ville
      const google_link = req.body.google_link
      const facebook_link = req.body.facebook_link
      const twitter_link = req.body.twitter_link
      const id_spec = req.body.id_spec
      const num_tel = req.body.num_tel
      const login = req.body.login
      const password = req.body.password
      bcrypt.hash(password, saltRounds, (err, hash) => {
       pool.query('INSERT INTO `docteur`  (`nom_doc`, `prenom_doc`, `adresse_cabinet`, `description`, `id_ville`, `num_tel`,`google_link`, `facebook_link`, `twitter_link`, `id_spec`) VALUES (?,?,?,?,?,?,?,?,?,?)', [nom_doc,prenom_doc,adresse_cabinet,description,id_ville,num_tel,google_link,facebook_link,twitter_link,id_spec],
        (err, result)  => {
            console.log(err);
            if (result){
              pool.query(
                "INSERT INTO `user`  (`login`, `password`, `id_docteur`) VALUES (?,?,?)",
                [login, hash, result.insertId],
                (err, rows) => {
                    if (!err)
                    res.send(rows);
                else
                    console.log(err);
                }
              );
            }
          }); 
      });
      
   
  });












Router.get('/ville', (req, res) => {
    pool.query(`SELECT ville.nom_ville FROM ville`, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}); 


Router.get('/spec', (req, res) => {
    pool.query(`SELECT specialite.nom_spec FROM specialite`, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}); 


Router.get('/search?', function(req, res, next) {
    var sql = `SELECT docteur.nom_doc, docteur.prenom_doc, docteur.adresse_cabinet, docteur.photo, docteur.description, docteur.google_link, docteur.facebook_link, docteur.twitter_link, ville.nom_ville, specialite.nom_spec FROM docteur INNER JOIN specialite ON docteur.id_spec=specialite.id_spec INNER JOIN ville ON ville.id_ville=docteur.id_ville  `;
    const existingParams = ["nom_doc","prenom_doc","nom_spec", "nom_ville"].filter(field => req.query[field]);

    if (existingParams.length) {
        sql += " WHERE ";
        sql += existingParams.map(field => `${field} = ?`).join(" AND ");
    }
console.log(sql);
    pool.query(
        sql,
        existingParams.map(field => req.query[field]),
        function (error, results, fields) {
            res.json({"status": 200, "error": null, "response": results});
        }
    );
});

Router.get('/', (req, res) => {
    pool.query(`SELECT docteur.id_docteur, docteur.nom_doc, docteur.prenom_doc, docteur.adresse_cabinet, docteur.photo, docteur.description, docteur.google_link, docteur.facebook_link, docteur.twitter_link, ville.nom_ville, specialite.nom_spec FROM docteur INNER JOIN specialite ON docteur.id_spec=specialite.id_spec INNER JOIN ville ON ville.id_ville=docteur.id_ville`, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

Router.get('/photo', (req, res) => {
    pool.query(`SELECT  photo FROM docteur WHERE id_docteur= ?`,[id_docteur], (err, rows, fields) => {
        if (err){
            console.log(err);
            res.send({
                msg:err
            })
    }if (result) {
        res.send({
           photo: result[0].photo ,
        });
    }
})
});
module.exports = Router;
