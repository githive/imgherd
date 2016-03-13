import restful from 'node-restful';
import { genSalt, hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

const mongoose = restful.mongoose;
mongoose.connect("mongodb://localhost/imgherd");

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

const SALT_WORK_FACTOR = 10;
const JWT_SECRET = 'v*jr&wjaxoes6famt@k08vn&88#4ykq$_^dfd(cf+yg=xxs3(%';
UserSchema.pre('save', function(next) {
  let user = this;

  if (!user.jwt_token) {
    user.jwt_token = sign(user, JWT_SECRET);
  }

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = restful.model('user', UserSchema);
User.methods(['get', 'post']);
User.before('get', notImplemented);
function notImplemented(req, res, next) {
  res.status(404).send('');
}
User.before('getDetail', isValidAuthentication);
function isValidAuthentication(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const type = authorizationHeader.split(' ')[0];
  const credentials = authorizationHeader.split(' ')[1];
  if (type === 'Bearer') {
    verify(credentials, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).send();
      }

      User.findOne({
        email: decoded._doc.email
      }, (err, user) => {
        user.comparePassword(decoded._doc.password, (err, isMatch) => {
          if (err || !isMatch) {
            res.status(403).send();
          }
        });
      });
    });
  } else {
    res.status(403).send();
  }
  next();
}

export default User;
