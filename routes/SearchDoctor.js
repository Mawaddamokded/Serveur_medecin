const express = require("express");
const Router = express.Router()
const pool = require("../config/dataBase");





Router.get('/ville', (req, res) => {
    pool.query(`SELECT * FROM ville`, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}); 


Router.get('/spec', (req, res) => {
    pool.query(`SELECT * FROM specialite`, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}); 


Router.get('/search?', function(req, res, next) {
    var sql = `SELECT docteur.id_docteur,
     docteur.nom_doc, docteur.prenom_doc, docteur.adresse_cabinet, docteur.photo, docteur.description, docteur.google_link, docteur.facebook_link, docteur.twitter_link, ville.nom_ville, specialite.nom_spec FROM docteur INNER JOIN specialite ON docteur.id_spec=specialite.id_spec INNER JOIN ville ON ville.id_ville=docteur.id_ville  `;
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
module.exports = Router;
