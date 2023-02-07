var express = require('express');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var employeeController = require('../controller/employee');
var schemaValidate = require('../validationSchema/schema');
var validation = require('../middleware/validate');

var employee = new express.Router();

employee.use(bodyParser.json());

employee.route('/')
.post(authenticate.verifyUser, employeeController.getEmployee)
.delete(authenticate.verifyUser, schemaValidate.deleteEmployee, validation.validateSchema, employeeController.deleteEmployee);

module.exports = employee;