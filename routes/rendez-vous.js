const express = require("express");
const Router = express.Router();
const pool = require("../config/dataBase");
//session patient





//session docteur
Router.get("/rdv", (req, res) => {
  pool.query(
    `SELECT rendezvous.id_rv, rendezvous.date_prise,rendezvous.confirmation,patient.id_patient,patient.nom_p,patient.prenom_p,patient.num_tel,patient.sexe,patient.date_naissance,patient.adresse,patient.cin,consultation.id_consult,consultation.remarque_consult,consultation.prix_consultation,ordonnance.nom_medicament,ordonnance.remarque_ord,analyse.id_analyse, analyse.titre,analyse.description,analyse.date,operation.id_operation, operation.date_operation, operation.nom_clinique, operation.prix_operation , operation.remarque FROM rendezvous INNER JOIN patient ON rendezvous.id_patient=patient.id_patient INNER JOIN consultation ON rendezvous.id_consult=consultation.id_consult INNER JOIN ordonnance ON ordonnance.id_ordonnance= consultation.id_consult INNER JOIN analyse ON analyse.id_analyse = consultation.id_analyse INNER JOIN operation ON operation.id_operation = consultation.id_operation`,
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

Router.get("/rdvdispo?", (req, res) => {
  pool.query(
    "SELECT * FROM `temps_consultation` WHERE temps_consultation.id_temps NOT IN (SELECT jour.id_temps FROM jour where jour=? )",
    [req.query.jour],
    (err, rows, fields) => {
      if (!err) console.log("success"), res.send(rows);
      else console.log(err);
    }
  );
});

Router.get("/rdvtoday", (req, res) => {
  pool.query(
    "SELECT rendezvous.id_rv, rendezvous.date_prise,rendezvous.confirmation,patient.id_patient,patient.nom_p,patient.prenom_p,patient.num_tel,patient.sexe,patient.date_naissance,patient.adresse,patient.cin,consultation.id_consult,consultation.remarque_consult,consultation.prix_consultation,ordonnance.nom_medicament,ordonnance.remarque_ord,analyse.id_analyse, analyse.titre,analyse.description,analyse.date,operation.id_operation, operation.date_operation, operation.nom_clinique, operation.prix_operation , operation.remarque FROM rendezvous INNER JOIN patient ON rendezvous.id_patient=patient.id_patient INNER JOIN consultation ON rendezvous.id_consult=consultation.id_consult INNER JOIN ordonnance ON ordonnance.id_ordonnance= consultation.id_consult INNER JOIN analyse ON analyse.id_analyse = consultation.id_analyse INNER JOIN operation ON operation.id_operation = consultation.id_operation WHERE `rendezvous`.`date_prise`=CURRENT_DATE",
    [req.params.date_prise],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

Router.get("/rdv/:id_patient", (req, res) => {
  pool.query(
    "SELECT rendezvous.id_rv, rendezvous.date_prise,rendezvous.confirmation,patient.id_patient,patient.nom_p,patient.prenom_p,patient.num_tel,patient.sexe,patient.date_naissance,patient.adresse,patient.cin,consultation.id_consult,consultation.remarque_consult,consultation.prix_consultation,ordonnance.nom_medicament,ordonnance.remarque_ord,analyse.id_analyse, analyse.titre,analyse.description,analyse.date,operation.id_operation, operation.date_operation, operation.nom_clinique, operation.prix_operation , operation.remarque FROM rendezvous INNER JOIN patient ON rendezvous.id_patient=patient.id_patient INNER JOIN consultation ON rendezvous.id_consult=consultation.id_consult INNER JOIN ordonnance ON ordonnance.id_ordonnance= consultation.id_consult INNER JOIN analyse ON analyse.id_analyse = consultation.id_analyse INNER JOIN operation ON operation.id_operation = consultation.id_operation WHERE `patient`.`id_patient`=?",
    [req.params.id_patient],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

Router.post("/updaterdv/:id_rv", (req, res) => {
  const date_prise = req.body.date_prise;
  const id_temps = req.body.id_temps;
  const confirmation = req.body.confirmation;
  const id_rv = req.params.id_rv;
  pool.query(
    "UPDATE `rendezvous` SET `date_prise`= ?,`confirmation`= ? ,`id_temps`= ? WHERE `id_rv`= ?",
    [date_prise, confirmation, id_temps, id_rv],
    (err, rows, fields) => {
      console.log("updated");
      if (err) {
        res.send({ err: err });
      } else console.log(err);
    }
  );
});


Router.delete("/deleterdv/:id_rv", (req, res) => {
  pool.query(
    "DELETE FROM `rendezvous` WHERE `id_rv`= ?",
    [req.params.id_rv],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

module.exports = Router;
