var express = require('express');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var scheduleController = require('../controller/schedule');
var schemaValidate = require('../validationSchema/schema');
var validation = require('../middleware/validate');

var schedule = express.Router();

schedule.use(bodyParser.json());

schedule.post('/', schemaValidate.saveData, validation.validateSchema, authenticate.verifyUser, scheduleController.schedule);

module.exports = schedule;