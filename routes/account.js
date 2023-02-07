var express = require('express');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var accountController = require('../controller/account');
var schemaValidate = require('../validationSchema/schema');
var validation = require('../middleware/validate');

var account = express.Router();

account.use(bodyParser.json());

account.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

account.post('/login', schemaValidate.login, validation.validateSchema, accountController.logIn);
account.post('/new_account', authenticate.verifyUser, authenticate.verifyManager, schemaValidate.createAccount, validation.validateSchema, accountController.createAccount);
account.post('/settings/account', authenticate.verifyUser, schemaValidate.updateAccount, validation.validateSchema, accountController.updateAccount);
account.post('/forgotPassword', schemaValidate.forgotPassword, validation.validateSchema, accountController.forgotPassword);

module.exports = account;