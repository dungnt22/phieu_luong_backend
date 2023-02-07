var express = require('express');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var uploadController = require('../controller/upload');

var upload = new express.Router();
upload.use(bodyParser.json());

upload.post('/', authenticate.verifyUser, uploadController.uploadFile);
upload.post('/preview', authenticate.verifyUser, uploadController.preview);

module.exports = upload;

