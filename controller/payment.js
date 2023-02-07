var Payment = require('../models/payment');

exports.getPayment = function(req, res, next) {
    let { employeeID, page, size} = req.body;
    if (!page) page = 1;
    if (!size) size = 5;

    Payment.find({employeeID: employeeID})
    .then((payments) => {
        let totalPayments = payments.length;
        let skip = (page - 1) * size;
        let lastRecordSent = page * size;
        let output = payments.slice(skip, lastRecordSent);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: 'OK',
            error: null,
            data: output,
            totalPayments: totalPayments
        })
    }, (err) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).json({
            message: 'Lỗi',
            error: err,
            data: null
        })
    })
};

exports.deletePayment = function(req, res, next) {
    const { employeeID, paymentID } = req.body;
    if (paymentID) {
        Payment.findByIdAndDelete(paymentID)
        .then((payment) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: 'OK',
                error: null,
                data: payment
            })
        }, (err) => next(err))
        .catch((err) => next(err))
    } else if (employeeID) {
        Payment.deleteMany({employeeID: employeeID})
        .then((deleteCount) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                message: 'OK', 
                error: null,
                data: deleteCount
            });
        }, (err) => next(err))
        .catch((err) => next(err))
    }
}