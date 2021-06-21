const express = require("express");
const app = express();
const cors = require("cors");

const SearchDoctorRoute = require("./routes/SearchDoctor");
const authentificationRoute = require("./routes/Authentification");
const rendezvousRoute = require("./routes/rendez-vous");
const fichePatientRoute = require("./routes/fichePatient");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use("/cabinet/docteur", SearchDoctorRoute);
app.use("/cabinet/docteur", authentificationRoute);
app.use("/cabinet/docteur", rendezvousRoute);
app.use("/cabinet/docteur", fichePatientRoute);
app.use(cors());

app.use(express.static(`config/doctors`));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", " http://127.0.0.1:3006"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware

  next();
});
app.listen(3000, function () {
  console.log("CORS-enabled web server listening on port 3000 ");
});
