import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
const PORT = process.env.PORT || 7000
import cors from 'cors'

const CORS_URL = process.env.CORS_URL || 'http://localhost:3000'

// Allow CORS from http://localhost:3000
app.use(cors({
  origin: CORS_URL
}));

import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'

import { connectDB } from './utils/connectDB.js';

import authRoute from './routes/auth-route.js';
import dashboardRoute from './routes/dashboard-route.js';
import apiRoute from './routes/api-routes.js';

app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        cookie: { maxAge: 6000 },
        resave: false,
        saveUninitialized: false
    })
)

app.use(flash())

// Set template engine
app.set("view engine", "ejs");

// serve static file
app.use(express.static('./public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/", authRoute)
app.use("/", dashboardRoute)
app.use("/", apiRoute)


connectDB(app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}))
