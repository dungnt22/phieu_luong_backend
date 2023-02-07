const { validationResult } = require('express-validator');

exports.validateSchema = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Lỗi',
            errors: errors.array()
        });
    }
    next();
}