const { required } = require('joi');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const employee = new schema({
    employeeCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    currentLevel: {
        type: String,
        required: true
    }
})

var Employees = mongoose.model('employee', employee);

module.exports = Employees;