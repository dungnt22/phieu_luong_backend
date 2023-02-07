var Payment = require('../models/payment');
var Employee = require('../models/employees');

exports.getEmployee = function(req, res, next) {
    var {employeeID, page, size } = req.body;
    if (employeeID) {
        Employee.findOne({ employeeCode: employeeID})
        .then((employee) => {
            if (employee) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    message: 'OK',
                    error: null,
                    data: employee,
                    totalRecord: 1
                });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({
                    message: 'Không tìm thấy nhân viên tương ứng',
                    error: null,
                    data: null
                })
            }
        }, (err) => next(err))
        .catch((err) => next(err))
    } else {
        if (!page) page = 1;
        if (!size) size = 5;
        
        Employee.find({})
        .then((employees) => {
            let totalRecord = employees.length;
            let skip = (page - 1) * size;
            let lastRecordSent = page * size;
            let output = employees.slice(skip, lastRecordSent);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: 'OK',
                error: null,
                data: output,
                totalRecord: totalRecord
            })
        }, (err) => {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                message: 'Lỗi',
                error: err,
                data: null
            });
        })
    }
};

exports.deleteEmployee = async function(req, res, next) {
    try {
        const employee = await Employee.findByIdAndDelete(req.body.employeeID);
        // const employee = await Employee.findOneAndDelete({employeeCode: req.body.employeeCode});
        if (employee) {
            const payments = await Payment.deleteMany({employeeID: employee._id});
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: 'OK',
                error: null,
                data: null,
                employee: employee,
                payments: payments
            });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({
                message: 'Không tìm thấy nhân viên với MSNV là: ' + req.body.employeeID,
                error: null,
                data: null
            });
            return;
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            message: 'Lỗi',
            error: error.message,
            data: null
        });
    }
}