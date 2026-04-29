const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.pluralize(null);
const cors = require('cors');



require('dotenv').config();

app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());

//app.use(bodyParser.json());
app.use(morgan('tiny'));


//"email": "john.doe@example.com",
//"password": "yourpassword"

//Routes

const feedbackRoutes = require('./routes/feedback');
const hospitalRoutes = require('./routes/hospital');
const appointmentRoutes = require('./routes/appointment');
const usersRoutes = require('./routes/users');
const billingRoutes = require('./routes/billing');
const labtestRoutes = require('./routes/labtest');

const prescriptionRoutes = require('./routes/prescription');


// Base path for all API routes. Falls back to '/api/v1' if not provided in .env
const api = process.env.API_URL || '/api/v1';

app.use('/public', express.static('public'));
app.use(`${api}/appointment`, appointmentRoutes);
app.use(`${api}/hospital`, hospitalRoutes);
app.use(`${api}/feedback`, feedbackRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/billing`, billingRoutes);
app.use(`${api}/labtest`, labtestRoutes);
app.use(`${api}/prescription`, prescriptionRoutes);




//CONNECTION_STRING = 'mongodb://localhost:27017/';
//  http://localhost:4000/api/v1/business/


//Database
// If CONNECTION_STRING is not set in .env, default to local MongoDB
const connectionString = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, // Add this line
    dbName: 'Hospital_App'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})

//Server
const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`server is running http://localhost:${port}`);
})

{/*
app.get("/message", (req, res) => {
    res.json({ message: "Hello from server!" });
  });
*/}