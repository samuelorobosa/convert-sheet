/**
 * Application: Convert Sheet Server
 *
 * Author: Samuel Amagbakhen
 *
 * Email: amagbakhensamuel@gmail.com
 */
const express = require('express');
const {sheetsRouter} = require("./src/routes/sheets/sheets.routes");
const app =  express();
const cors             = require('cors');
const port = process.env.PORT || 8000;

/**
 * Middlewares Start
 */
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json());
app.use(sheetsRouter);
app.use(express.static('conversions'));
/**
 * Middlewares End
 */

app.listen(port);