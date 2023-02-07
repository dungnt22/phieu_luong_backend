var express = require('express');
var bodyParser = require('body-parser');

var authenticate = require('../authenticate');
var paymentController = require('../controller/payment');

var payment = new express.Router();

payment.use(bodyParser.json());

payment.route('/')
.post(authenticate.verifyUser, paymentController.getPayment)
.delete(authenticate.verifyUser, paymentController.deletePayment); 

module.exports = payment;