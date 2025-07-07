const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const UserDetails = require('../model/mngusermodel'); // Your MySQL model
 
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Match user by email using the MySQL model
        const user = await UserDetails.findOne(email);
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        if (!password || !user.user_password) {
          console.log("iputPassword: ", password);
          console.log("storedHashedPassword: ", user_password);
          console.error('Missing password for comparison!');
          return false;
        }
        
        // Match password using bcrypt
        const isMatch = await bcrypt.compare(password, user.user_password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize the user by storing the user id
  passport.serializeUser((user, done) => {
    done(null, user.user_email); // Store email or user id, depending on your preference
  });

  // Deserialize user from email
  passport.deserializeUser(async (user_email, done) => {
    try {
      const user = await UserDetails.findOne(user_email);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
