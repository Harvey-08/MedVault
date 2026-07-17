const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.pluralize(null);
mongoose.set('strictQuery', false);
const cors = require('cors');
const helmet = require('helmet');



require('dotenv').config();

const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',') 
    : ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    },
    credentials: true
}));
app.options('*', cors());

app.use(helmet());

//middleware
app.use(express.json());

//app.use(bodyParser.json());
app.use(morgan('tiny'));

// Rate limiting configuration
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Max 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});


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
const consentRoutes = require('./routes/consent');


// Base path for all API routes. Falls back to '/api/v1' if not provided in .env
const api = process.env.API_URL || '/api/v1';

app.use(`${api}/users/login`, loginLimiter);

app.use('/public', express.static('public'));
app.use(`${api}/appointment`, appointmentRoutes);
app.use(`${api}/hospital`, hospitalRoutes);
app.use(`${api}/feedback`, feedbackRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/billing`, billingRoutes);
app.use(`${api}/labtest`, labtestRoutes);
app.use(`${api}/prescription`, prescriptionRoutes);
app.use(`${api}/consent`, consentRoutes);

// Global Error Handler Middleware
const errorHandler = require('./helpers/errorHandler');
app.use(errorHandler);




//CONNECTION_STRING = 'mongodb://localhost:27017/';
//  http://localhost:4000/api/v1/business/


//Database
// If CONNECTION_STRING is not set in .env, default to local MongoDB
const connectionString = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/';

mongoose.connect(connectionString, {
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