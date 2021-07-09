const express = require("express");
const Router = express.Router()
const pool = require("../config/dataBase");


Router.get('/allpatient/', (req, res) => {
    pool.query("SELECT `id_patient`, `num_tel`, `nom_p`, `prenom_p`, `date_naissance`, `sexe`, `adresse`, `cin`, `id_rv` FROM `patient` ",
     [req.params.id_patient], (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

Router.post('/updatepatient/:id_patient', (req, res) => {
    const num_tel = req.body.num_tel
    const nom_p = req.body.nom_p
    const prenom_p = req.body.prenom_p
    const date_naissance = req.body.date_naissance
    const sexe = req.body.sexe
    const addresse = req.body.addresse
    const cin = req.body.cin
    const id_rv = req.body.id_rv
    const id_patient = req.params.id_patient
    pool.query("Update `patient` SET `num_tel`= ? , `nom_p` = ?, `prenom_p`= ? , `date_naissance`= ? , `sexe`= ?, `adresse`= ?, `cin`= ?, `id_rv` = ? where `id_patient`= ? ",
     [num_tel, nom_p, prenom_p, date_naissance, sexe, addresse, cin , id_rv , id_patient], (err, rows) => {
        if (!err)
        console.log('updated');
        else
            console.log(err);
    })
});

Router.delete('/patient/:id_patient', (req, res) => {
    pool.query(`DELETE FROM patient WHERE id_patient=?`,
     [req.params.id_patient], (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

Router.get('/temps', (req, res) => {
     /* WHERE `disponibilite`=1 */
    pool.query("SELECT * FROM `temps_consultation`",
      (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});



module.exports = Router;