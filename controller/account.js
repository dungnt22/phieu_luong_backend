var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');
var sgMail = require('@sendgrid/mail');
var nodemailer = require('nodemailer');

var Account = require('../models/accounts');
const authenticate = require('../authenticate');
const config = require('../config');

const saltRounds = 10;
const API_KEY = config.SENDGRID_API_KEY;
sgMail.setApiKey(API_KEY);

exports.logIn = function(req, res, next) {
    Account.findOne({ email: req.body.username})
    .then((user) => {
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            res.status(401).json({
                message: 'Đăng nhập không thành công',
                error: 'Thông tin sai',
                data: null
            })
        } else {
            var hash = user.password;
            bcrypt.compare(req.body.password, hash, (err, result) => {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(401).json({
                        message: "Đăng nhâp không thành công",
                        error: err,
                        data: null
                    });
                }
                if (result) {
                    var token = authenticate.getToken({_id: user._id});
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({
                        message: 'OK',
                        error: null,
                        data: user,
                        token: token
                    })
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(401).json({
                        message: 'Đăng nhập không thành công',
                        error: null,
                        data: null
                    })
                }
            })
        }
    }, (err) => next(err))
    .catch((err) => next(err))
};

exports.createAccount = function(req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            next(err);
        } else {
            Account.create({username: req.body.username, password: hash, role: req.body.role})
            .then((user) => {
                user.email = req.body.username;
                user.save((err) => {
                    if (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(500).json({
                            message: 'Tạo tài khoản không thành công',
                            error: err,
                            data: null
                        });
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json({
                            message: 'OK',
                            error: null,
                            data: user
                        })
                    }
                })
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    })
};

exports.updateAccount = async function(req, res, next) {
    const { oldPass, newPass, newPassVal, lastName, firstName, phone } = req.body;
    try {
        let account = await Account.findById(req.user._id);
        if (lastName) account.lastName = lastName;
        if (firstName) account.firstName = firstName;
        if (phone) account.phone = phone;
        if (oldPass && newPass && newPassVal) {
            const hash = req.user.password;
            const result = await bcrypt.compare(oldPass, hash);
            if (result) {
                if (newPass !== newPassVal) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(404).json({
                        message: 'Mật khẩu mới không trùng khớp',
                        error: null,
                        data: null
                    })
                    return;
                } else {
                    const newHash = bcrypt.hashSync(newPass, saltRounds);
                    account.password = newHash;
                }
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({
                    message: 'Mật khẩu cũ không chính xác',
                    error: null,
                    data: null
                })
                return;
            }
        }
        await account.save();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: 'OK',
            error: null,
            data: account
        });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            message: 'Lỗi',
            error: error.message,
            data: null
        })
    }
};

// exports.forgotPassword = async function(req, res, next) {
//     const { email } = req.body;
//     try {
//         const newPass = randomstring.generate({
//             length: 10,
//             charset: 'alphabetic'
//         })

//         const account = await Account.findOne({email: email});
//         if (account) {
//             const hash = bcrypt.hashSync(newPass, saltRounds);
//             account.password = hash;
//             await account.save();
//             const msg = {
//                 to: email,
//                 from: 'lamvybn01@gmail.com',
//                 subject: 'CẤP LẠI MẬT KHẨU',
//                 text: 'Mật khẩu mới là: ' + newPass
//             };
//             await sgMail.send(msg)

//             res.setHeader('Content-Type', 'application/json');
//             res.status(200).json({
//                 message: 'OK',
//                 error: null,
//                 data: null
//             });
//         } else {
//             res.setHeader('Content-Type', 'application/json');
//             res.status(404).json({
//                 message: 'Không tìm thấy địa chỉ email cung cấp',
//                 error: null,
//                 data: null
//             })
//         }
//     } catch (error) {
//         res.setHeader('Content-Type', 'application/json');
//         res.status(500).json({
//             message: 'Lỗi',
//             error: error.message,
//             data: null
//         })
//     }
// };

exports.forgotPassword = async function(req, res, next) {
    const { email } = req.body;
    try {
        const newPass = randomstring.generate({
            length: 10,
            charset: 'alphabetic'
        })

        const account = await Account.findOne({email: email});
        if (account) {
            const hash = bcrypt.hashSync(newPass, saltRounds);
            // account.password = hash;
            // await account.save();
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'accounting@bglobalcorp.com',
                    pass: 'iaruapbxgnpujpnw' 
                }
            });
    
            let mailOptions = {
                from: 'accounting@bglobalcorp.com',
                to: email,
                subject: 'CẤP LẠI MẬT KHẨU',
                text: 'Mật khẩu mới là: ' + newPass
            }

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    throw error;
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
            account.password = hash;
            account.save();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: 'OK',
                error: null,
                data: null
            });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({
                message: 'Không tìm thấy địa chỉ email cung cấp',
                error: null,
                data: null
            })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            message: 'Lỗi',
            error: error.message,
            data: null
        })
    }
}