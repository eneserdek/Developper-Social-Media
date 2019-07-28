const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route     GET api/auth
// @desc      Test route
// @access    Public

router.get('/', auth /*adding this will make this route protected*/, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error`);
  }
});

// @route     POST api/auth
// @desc      Authenticate user & get token
// @access    Public

router.post(
  '/',
  [
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: [{ msg: 'Invalid credentials' }] });
      }
      //to check whether the password entered by user matches

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: [{ msg: 'Invalid credentials' }] });
      }
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
          expiresIn: 360000 /*it means an hour*/,
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
