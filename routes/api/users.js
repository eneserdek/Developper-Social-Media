const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//User Model
const User = require('../../models/User');

// @route     POST api/users
// @desc      Register user
// @access    Public

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Your password should have at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: [{ msg: 'User already exists' }] });
      }

      //Get users gravatar
      const avatar = gravatar.url({
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //still user is not saved

      await user.save(); // now user is saved

      // Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret' /*the same we did with mongoDB*/),
        {
          expiresIn: 3600 /*it means an hour*/,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
      //res.send(`User registered`); this is part is not necessary when we apply the payload and jwt
    } catch (err) {
      console.error(err);
      res.status(500).send(`Server error`);
    }
  },
);

module.exports = router;
