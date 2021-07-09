const express = require('express');
const app = express();
const cors = require("cors");

const SearchDoctorRoute = require("./routes/SearchDoctor");
const authentificationRoute = require("./routes/Authentification");
const rendezvousRoute = require("./routes/rendez-vous");
const fichePatientRoute = require("./routes/fichePatient");

app.use("/cabinet/docteur", SearchDoctorRoute);
app.use("/cabinet/docteur", authentificationRoute);
app.use("/cabinet/docteur", rendezvousRoute);
app.use("/cabinet/docteur", fichePatientRoute);

app.use(cors());

app.use(express.static(`config/doctors`))
app.listen(3000, () => console.log('Express server is runnig at port  : 3000'));
