"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const user_1 = require("../Model/user");
class UserController {
    // ========================================
    // Login Route
    // ========================================
    postLogin(req, res, next) {
        if (req.user) {
            return res.status(200).json({ error: "You are already logged in" });
        }
        user_1.User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
                return res.status(400).json({ error: "bad data" });
            }
            if (!user) {
                return res.status(400).json({ error: "Your login details could not be verified." });
            }
            user.comparePassword(req.body.password, function (comparedPasswordErr, isMatch) {
                if (comparedPasswordErr) {
                    return res.status(400).json({ error: "bad data" });
                }
                if (!isMatch) {
                    return res.status(400).json({ error: "Your login details could not be verified." });
                }
                const userInfo = user.toJSON();
                res.status(200).json({
                    token: "Bearer " + jsonwebtoken_1.default.sign(userInfo, config_1.default.secret, { expiresIn: 10080 }),
                    user: userInfo
                });
            });
        });
    }
    // ========================================
    // Registration Route
    // ========================================
    register(req, res, next) {
        // Check for registration errors
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        if (!email) {
            return res.status(422).send({ error: "You must enter an email address." });
        }
        if (!firstName || !lastName) {
            return res.status(422).send({ error: "You must enter your full name." });
        }
        if (!password) {
            return res.status(422).send({ error: "You must enter a password." });
        }
        user_1.User.findOne({ email }, function (err, existingUser) {
            if (err) {
                return next(err);
            }
            if (existingUser) {
                return res.status(422).send({ error: "This email address is already registered." });
            }
            else {
                const user = new user_1.User({
                    email,
                    is_admin: false,
                    is_developer: false,
                    password,
                    profile: { firstName, lastName },
                    status: "New User"
                });
                user.save(function (saveErr, newUser) {
                    if (saveErr) {
                        return next(saveErr);
                    }
                    const userInfo = newUser.toJSON();
                    res.status(201).json({
                        token: "Bearer " + jsonwebtoken_1.default.sign(userInfo, config_1.default.secret, { expiresIn: 10080 }),
                        user: userInfo
                    });
                });
            }
        });
    }
    // ========================================
    // Logout Route
    // ========================================
    logout(req, res) {
        req.logOut();
    }
    getUsers(req, res) {
        user_1.User.find({}, (err, users) => {
            if (err) {
                res.send(err);
            }
            res.status(200).send(users);
        });
    }
    getUserById(req, res) {
        user_1.User.findById({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.status(200).send(user.toJSON());
        });
    }
    updateUser(req, res) {
        user_1.User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.status(200).send(user.toJSON());
        });
    }
    deleteUser(req, res) {
        if (!req.user) {
            res.status(401).send({ message: "You are log in" });
        }
        // if (!req.user.is_admin) {
        //     res.status(401).send({ message: "You are not admin"});
        // }
        user_1.User.remove({ _id: req.params.userId }, (err) => {
            if (err) {
                res.status(422).send({ message: "Unsuccessfully Delete User!" });
            }
            res.status(422).send({ message: "Successfully Deleted User!" });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map