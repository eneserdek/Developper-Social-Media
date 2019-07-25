const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profiles');
const User = require('../../models/User');

// @route     GET api/profile/me
// @desc      GET users profile
// @access    Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      return res.status(400).json({ msg: `Profile not found` });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error`);
  }
});

// @route     POST api/profile/
// @desc      Post or update users profile
// @access    Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills are required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      instagram,
      linkedin,
    } = req.body;

    // Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profile.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // Build profile social accounts array
    profileFields.social = {};
    profileFields.social.youtube = youtube;
    profileFields.social.twitter = twitter;
    profileFields.social.facebook = facebook;
    profileFields.social.linkedin = linkedin;
    profileFields.social.instagram = instagram;
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
        );
        return res.json(profile);
      }

      // Create

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(`Server Error`);
    }
  },
);

// @route     GET api/profile
// @desc      GET all users profile
// @access    Public

router.get('/', async (req, res) => {
  //to all profiles

  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    onsole.error(err.message);
    res.status(500).send(`Server Error`);
  }
});

// @route     GET api/profile/user/:user_id
// @desc      GET profile by user id
// @access    Public

router.get('/user/:user_id', async (req, res) => {
  //to get a unique profile
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profile) {
      return res.status(400).json({ msg: `Profile not found` });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') return res.status(400).json({ msg: `Profile not found` });
    res.status(500).send(`Server Error`);
  }
});

// @route     DELETE api/profile/
// @desc      DELETE profile, user & posts
// @access    Private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo remove user posts
    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: `User deleted` });
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') return res.status(400).json({ msg: `Profile not found` });
    res.status(500).send(`Server Error`);
  }
});

module.exports = router;