const express = require('express');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const {uploadFile, welcomeFunc, downloadFile} = require("./sheets.controller");
const sheetsRouter = express.Router();

/**
 * Routes Definition
 */

sheetsRouter.get('/', welcomeFunc);
sheetsRouter.post('/file/upload', upload.single('sheet'), uploadFile);

module.exports = {
    sheetsRouter
};

