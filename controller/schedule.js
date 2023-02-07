var scheduleNode = require('node-schedule');
var sgMail = require('@sendgrid/mail');
var fs = require('fs');
var nodemailer = require('nodemailer');

var Payment = require('../models/payment');
var Employee = require('../models/employees');
var config = require('../config');
var convertToPdf = require('../convertToPdf');

var { PaymentDTO } = require('../DTO/paymentDTO');
var { EmployeeDTO } = require('../DTO/employeeDTO');

let sendDate;
const API_KEY = config.SENDGRID_API_KEY;
sgMail.setApiKey(API_KEY);

const EventEmitter = require('events');
class Ee extends EventEmitter {}

const jobStatus = new Ee();

jobStatus.on('finished', async () => {
    try {
        /**
         * update payment status
         * 
         */
        let payments = await Payment.find({sendDate: sendDate})
        await Promise.all(payments.map(async (payment) => {
            payment.status = 2;
            await payment.save();
        }))
        console.log('send mail successfully');
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Lỗi gửi mail',
            error: error.message,
            data: null
        })
    }
})

async function sendMail(employees) {
    if (!employees) return;
    try {
        await Promise.all(employees.map(async (empl) => {
            const attachment = fs.createReadStream('public/pdfs/' + empl.name + '_Encrypt.pdf');

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'accounting@bglobalcorp.com',
                    pass: 'iaruapbxgnpujpnw' 
                }
            });

            let mailOptions = {
                from: 'accounting@bglobalcorp.com',
                to: empl.email,
                subject: 'PHIẾU LƯƠNG NHÂN VIÊN',
                text: empl.emailContent + '\nMật khẩu: ' + empl.filePass,
                attachments: [
                    {
                        content: attachment,
                        filename: "Phiếu lương " + empl.month + ".pdf",
                        contentType: "application/pdf",
                    }
                ]
            }

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    throw error;
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

            fs.rm('public/template/' + empl.name + '.xlsx', {
                force: true,
                maxRetries: 2,
                retryDelay: 500
            }, (err) => {
                if (err) throw err
                console.log('Delete file successfully');
            });

            fs.rm('public/pdfs/' + empl.name + '.pdf', {
                force: true,
                maxRetries: 2,
                retryDelay: 500
            }, (err) => {
                if (err) throw err
                console.log('Delete file successfully');
            })
        }))
    } catch (error) {
        console.log(error)
    } 
}

exports.schedule = async function(req, res, next) {
    try {
        let { scheduleDate, employees } = req.body;

        if (!scheduleDate) {
            scheduleDate = new Date().getTime() + 10000;
        } else {
            let nowDate = new Date().getTime();
            if ((scheduleDate - nowDate) < 60000) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({
                    message: 'Thời gian đặt lịch không hợp lệ. Thời gian trong quá khứ.',
                    error: null,
                    data: null
                });
            }
        }

        if (!employees.length) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({
                message: 'Danh sách gửi mail trống',
                error: null,
                data: null
            });
        }

        sendDate = new Date(scheduleDate);

        await Promise.all(employees.map(async (element) => {
            await convertToPdf.convertAsync(element);
            
            /**
             * create employee if not exist
             * 
             * create payment
             */
            let empl = await Employee.findOne({employeeCode: element.employeeCode})
            if (!empl) {
                empl = await Employee.create(new EmployeeDTO(element));
            }
             
            let payment = await Payment.create(new PaymentDTO(element));
            payment.sendDate = sendDate;
            payment.createBy = req.user._id;
            payment.employeeID = empl._id;
            await payment.save();
        }));

        res.setHeader('Content-Type','application/json');
        res.status(200).json({
            message: 'OK',
            error: null,
            data: null
        });

        
        scheduleNode.scheduleJob(scheduleDate + 5000, async () => {
            console.log('sendmail');
            await sendMail(employees);
            jobStatus.emit('finished');
        })
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Lỗi gửi mail',
            error: error.message,
            data: null
        })
    }
}