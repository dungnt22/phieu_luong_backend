const { body } = require('express-validator');

exports.login = [
    body('username').isEmail()
                    .withMessage('Địa chỉ email không hợp lệ')
                    .bail(),
    body('password').notEmpty()
                    .withMessage('Thiếu mật khẩu')
]

exports.createAccount = [
    body('username').isEmail()
                    .withMessage('Địa chỉ email không hợp lệ')
                    .bail(),
    body('password').isLength({min: 8})
                    .withMessage('Mật khẩu cần có ít nhất 8 ký tự')
                    .bail(),
    body('role').isString()
                .withMessage('Thiếu chức vụ')
]

exports.updateAccount = [
    body('oldPass').if(body('newPass').exists())
                    .notEmpty()
                    .withMessage('Nhập mật khẩu hiện tại')
]

exports.forgotPassword = [
    body('email').isEmail()
                .withMessage('Địa chỉ email không hợp lệ')
]

exports.saveData = [
    body('employees').isArray(),
    body('employees.*.email').isEmail()
                    . withMessage('Địa chỉ email không hợp lệ')
]

exports.deleteEmployee = [
    body('employeeID').notEmpty()
                        .withMessage('Thiếu mã nhân viên')
]