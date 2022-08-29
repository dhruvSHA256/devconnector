const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

if (!GITHUB_CLIENT_ID) {
    console.error(
        '[error]: The "GITHUB_CLIENT_ID" environment variable is required',
    );
    process.exit(1);
}

if (!GITHUB_SECRET) {
    console.error(
        '[error]: The "GITHUB_TOKEN" environment variable is required',
    );
    process.exit(1);
}

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_SECRET}`,
        );
        const gitHubResponse = await axios.get(uri);
        return res.json(gitHubResponse.data);
    } catch (err) {
        console.error(err.message);
        return res
            .status(404)
            .json({ errors: [{ msg: 'No Github profile found' }] });
    }
});

//@route  DELETE api/profile/education/:edu_id
//@desc   Delete profile education
//@access private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const newEducation = profile.education.filter(
            (item) => item.id != req.params.edu_id,
        );
        profile.education = newEducation;
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//@route  PUT api/profile/education
//@desc   add education to profile
//@access private
router.put(
    '/education',
    auth,
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field is required').notEmpty(),
    check('from', 'From Date is required')
        .notEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(req.body);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
);

//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete profile experience
//@access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const newExperience = profile.experience.filter(
            (item) => item.id != req.params.exp_id,
        );
        profile.experience = newExperience;
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//@route  PUT api/profile/experience
//@desc   add experience to profile
//@access private
router.put(
    '/experience',
    auth,
    check('company', 'Company is required').notEmpty(),
    check('title', 'Title is required').notEmpty(),
    check('from', 'From Date is required')
        .notEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(req.body);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
);

//@route  DELETE api/profile
//@desc   delete user profile and posts
//@access private
router.delete('/', auth, async (req, res) => {
    try {
        // delete all posts from user
        await Post.deleteMany({ user: req.user.id });
        // delete profile
        await Profile.findOneAndDelete({ user: req.user.id });
        // delete user
        await User.findOneAndDelete({ _id: req.user.id });
        res.json({ errors: [{ msg: 'User deleted' }] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//@route  GET api/profile/user/:user_id
//@desc   Get Profile by user id
//@access public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar']);
        if (!profile)
            return res
                .status(400)
                .json({ errors: [{ msg: 'No profile for user' }] });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId')
            return res
                .status(400)
                .json({ errors: [{ msg: 'No profile for user' }] });
        res.status(500).send('Internal Server Error');
    }
});

//@route  GET api/profile
//@desc   Get All Profiles
//@access public
router.get('/', async (_req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar'],
        );

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//@route    POST api/profile/
//@desc     Create or Update user's profile
//@access   private
router.post(
    '/',
    auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills are required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // create profile and return success msg
        const {
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body;

        const profileFields = {
            user: req.user.id,
            website:
                website && website !== ''
                    ? normalize(website, { forceHttps: true })
                    : '',
            skills: Array.isArray(skills)
                ? skills
                : skills.split(',').map((skill) => ' ' + skill.trim()),
            ...rest,
        };

        const socialFields = {
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
        };

        for (const [key, value] of Object.entries(socialFields)) {
            if (value && value.length > 0)
                socialFields[key] = normalize(value, { forceHttps: true });
        }
        profileFields.social = socialFields;

        // update profile if found else create new profile
        try {
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true, setDefaultsOnInsert: true },
            );
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
    },
);

module.exports = router;
