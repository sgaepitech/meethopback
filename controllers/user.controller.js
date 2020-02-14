const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/user.model');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const authRegister = require('../auth/register.validator');
const authLogin = require('../auth/login.validator');
const auth = require("../auth/auth");

mongoose.set('useFindAndModify', false);

/**
 * @api {post} /create Create User
 * @apiGroup User
 * @apiSuccess {Object[]} user Elements attached to an user
 * @apiSuccess {String} user._id User ID
 * @apiSuccess {String} user.username Username from the created user
 * @apiSuccess {String} user.password User password
 * @apiSuccess {String} user.location User location
 * @apiSuccess {String} user.avatar User profile picture
 * @apiSuccess {String} user.banner User Banner
 * @apiSuccess {Date} user.birthdate User birthdate
 * @apiSuccess {String} user.warnings Number of times this user has been reported
 * @apiSuccess {Boolean} user.isActive Check if the account is active
 * @apiSuccess {Array} user.isWaitingForEvent List of events the user wants to participate but need approval by the owner of the event
 * @apiSuccess {Array} user.isApprovedFromEvent List of events the user wants to participate and have been approved by the owner of the event
 * @apiSuccess {Array} user.interests User interests
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
        "interests": [
            "salon, sport, nautique"
        ],
        "warnings": 0,
        "isActive": true,
        "isWaitingForEvent": [],
        "isApprovedFromEvent": [],
        "avatar": "myavatar.png",
        "banner": "mybanner.png",
        "_id": "5e458c5ea194ae01e7487932",
        "username": "tati",
        "email": "tati@tati.com",
        "password": "password",
        "birthdate": "1970-01-01T00:16:52.000Z",
        "location": "paris",
        "__v": 0
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post("/create", async (req, res) => {
    const { errors, isValid } = authRegister(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne(
            { email: req.body.email }
    )
    .then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    birthdate: req.body.birthdate,
                    location: req.body.location,
                    interests: req.body.interests
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});


router.get("/users", (req,res) =>{
  User.find((err, users) =>{
    if(err){
      console.log(err)
    }else {
      res.json(users);
    }
  })
});


/**
 * @api {get} /read Read Current Authentified User
 * @apiGroup User
 * @apiSuccess {Object[]} user Elements attached to an user
 * @apiSuccess {String} user._id User ID
 * @apiSuccess {String} user.username Username from the created user
 * @apiSuccess {String} user.location User location
 * @apiSuccess {String} user.avatar User profile picture
 * @apiSuccess {String} user.banner User Banner
 * @apiSuccess {Date} user.birthdate User birthdate
 * @apiSuccess {String} user.warnings Number of times this user has been reported
 * @apiSuccess {Boolean} user.isActive Check if the account is active
 * @apiSuccess {Array} user.isWaitingForEvent List of events the user wants to participate but need approval from the owner of the event
 * @apiSuccess {Array} user.isApprovedFromEvent List of events the user wants to participate and have been approved by the owner of the event
 * @apiSuccess {Array} user.interests User interests
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
        "interests": [
            "concert",
            "sport",
            "plein air",
        ],
        "warnings": 0,
        "isActive": true,
        "isWaitingForEvent": [],
        "isApprovedFromEvent": [],
        "avatar": "myavatar.png",
        "banner": "mybanner.png",
        "_id": "5e3aa185acf7411e24690aaf",
        "username": "janedoe",
        "email": "jane@doe.com",
        "birthdate": "1970-01-01T00:16:52.000Z",
        "location": "montpellier",
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/read", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
});


/**
 * @api {get} /:id User by ID
 * @apiGroup User
 * @apiSuccess {Object[]} user Elements attached to an user
 * @apiSuccess {String} user._id User ID
 * @apiSuccess {String} user.username Username from the created user
 * @apiSuccess {String} user.password User password
 * @apiSuccess {String} user.location User location
 * @apiSuccess {String} user.avatar User profile picture
 * @apiSuccess {String} user.banner User Banner
 * @apiSuccess {Date} user.birthdate User birthdate
 * @apiSuccess {String} user.warnings Number of times this user has been reported
 * @apiSuccess {Boolean} user.isActive Check if the account is active
 * @apiSuccess {Array} user.isWaitingForEvent List of events the user wants to participate but need approval from the owner of the event
 * @apiSuccess {Array} user.isApprovedFromEvent List of events the user wants to participate and have been approved by the owner of the event
 * @apiSuccess {Array} user.interests User interests
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *    [{
        "interests": [
        "concert",
        "sport",
    ],
    "warnings": 0,
    "isActive": true,
    "isWaitingForEvent": [],
    "isApprovedFromEvent": [],
    "avatar": "monavatar.png",
    "banner": "mabanner.png",
    "_id": "5e3aa185acf7411e24690aaf",
    "username": "janedoe",
    "email": "jane@doe.com",
    "password": "hashedpassword",
    "birthdate": "1970-01-01T00:16:52.000Z",
    "location": "montpellier",
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/:id", auth, (req,res) =>{
  User.findById((req.params.id), (err, user) =>{
    if(err){
      console.log(err)
    } else {
      res.json(user)
    }
  })
});

/**
 * @api {update} /update Update user
 * @apiGroup User
 * @apiSuccess {Object[]} user Elements attached to an user
 * @apiSuccess {String} user._id User ID
 * @apiSuccess {String} user.username Username from the created user
 * @apiSuccess {String} user.email Email from the created user
 * @apiSuccess {String} user.password User password
 * @apiSuccess {String} user.location User location
 * @apiSuccess {Date} user.birthdate User birthdate
 * @apiSuccess {Array} user.interests User interests
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *    [{
        "_id": "5e3aa185acf7411e24690aaf",
        "username": "janedoe",
        "email": "jane@doe.com",
        "password": "$2b$10$aRgoYH2MxXtnoxKCoUFWh.1S3130JCqlClfiI5fyJJtaaP94BuJm.",
        "birthdate": "1970-01-01T00:16:52.000Z",
        "location": "montpellier",
        "interests": [
            "concert",
            "sport",
            "plein air",
            "jeux de société"
        ]
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/update", auth, (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
        if (err)
            return next(error);
        else {
            if (req.body.username) { user.username = req.body.username; }
            if (req.body.email) { user.email = req.body.email; }
            if (req.body.password) {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        });
                    });
            }
            if (req.body.description) { user.description = req.body.description; }
            if (req.body.location) { user.location = req.body.location; }
            if (req.body.interests) { user.interests = req.body.interests; }

            user.save();
            res.status(200).json({
                _id: req.user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                birthdate: user.birthdate,
                description: user.description,
                location: user.location,
                interests: user.interests
            });
        }
    });
});

/**
 * @api {delete} /delete Delete user
 * @apiGroup User
 * @apiSuccess {Object[]} user Elements attached to an user
 * @apiSuccess {String} user._id User ID
 * @apiSuccess {String} user.username Username from the created user
 * @apiSuccess {String} user.email Email from the created user
 * @apiSuccess {String} user.password User password
 * @apiSuccess {String} user.location User location
 * @apiSuccess {Date} user.birthdate User birthdate
 * @apiSuccess {Array} user.interests User interests
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *    [{
        "_id": "5e3aa185acf7411e24690aaf",
        "username": "janedoe",
        "email": "jane@doe.com",
        "password": "$2b$10$aRgoYH2MxXtnoxKCoUFWh.1S3130JCqlClfiI5fyJJtaaP94BuJm.",
        "birthdate": "1970-01-01T00:16:52.000Z",
        "location": "montpellier",
        "interests": [
            "concert",
            "sport",
            "plein air",
            "jeux de société"
        ]
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete("/delete", auth, (req, res, next) => {
    User.findByIdAndRemove(req.user._id, (err, user) => {
        if (err)
            return next(error);
        else {
            res.status(200).json({msg: user});
        }
    });
});

/**
 * @api {post} /login Login user
 * @apiGroup User
 * @apiSuccess {Object[]} user Elements attached to an user
 * @apiSuccess {String} user._id User ID
 * @apiSuccess {String} user.username Username from the created user
 * @apiSuccess {String} user.email Email from the created user
 * @apiSuccess {String} user.password User password
 * @apiSuccess {String} user.location User location
 * @apiSuccess {Date} user.birthdate User birthdate
 * @apiSuccess {Array} user.interests User interests
 * @apiSuccess {String} user.token User access token
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *    [{
        "_id": "5e39985596eb2e1bd6b9db22",
        "username": "test",
        "email": "test@test.com",
        "password": "$2b$10$Hb2z9l1fjO1PEBfr1e/FzuTbY4Yn6nnZ2HlLT9FQCfzD7FUrFUQWC",
        "birthdate": "2014-01-01T23:28:56.782Z",
        "description": "J'ai RIEN a dire",
        "location": "Nantes",
        "interests": [],
        "token": "accessToken"
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post("/login", (req, res) => {
    const { errors, isValid } = authLogin(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const accessToken = user.generateAuthToken();
                res.header("x-auth-token", accessToken).send({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    birthdate: user.birthdate,
                    description: user.description,
                    location: user.location,
                    interests: user.interests,
                    token: accessToken
                });
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

module.exports = router;
