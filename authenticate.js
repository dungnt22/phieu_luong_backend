var passport = require('passport');
var LocalStratery = require('passport-local').Strategy;
var JwtStratery = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var Account = require('./models/accounts');
var config = require('./config');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 24 * 60 * 60});
}

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;

exports.jwtPassport =  passport.use(new JwtStratery(options, (jwt_payload, done) => {
    console.log("JWT Payload: " + jwt_payload._id);
    Account.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}))

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyManager = function(req, res, next) {
    if (req.user.role === 'Manager') {
        next();
    } else {
        var error = new Error('Truy cập không hợp lệ.');
        error.status = 401;
        next(error);
    }
}