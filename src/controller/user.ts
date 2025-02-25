import { NextFunction, Request, Response  } from "express";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config";
import { User, UserDocument } from "../Model/user";

export class UserController {

    // ========================================
    // Login Route
    // ========================================
    public postLogin(req: Request, res: Response, next: NextFunction) {
        if (req.user) {
            return res.status(200).json({ error: "You are already logged in" });
        }

        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                return res.status(400).json({ error: "bad data" });
            }

            if (!user) {
                return res.status(400).json({ error: "Your login details could not be verified." });

            }
            user.comparePassword(req.body.password, function(comparedPasswordErr, isMatch) {
                if (comparedPasswordErr) {
                    return res.status(400).json({ error: "bad data" });
                }

                if (!isMatch) {
                    return res.status(400).json({ error: "Your login details could not be verified." });
                }

                const userInfo = user.toJSON();
                res.status(200).json({
                        token: "Bearer " + jsonwebtoken.sign(userInfo, config.secret , { expiresIn: 10080 }),
                        user: userInfo
                    });
            });
        });
    }

    // ========================================
    // Registration Route
    // ========================================
    public register(req: Request, res: Response, next: NextFunction) {
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

        User.findOne({ email }, function(err, existingUser) {
            if (err) { return next(err); }
            if (existingUser) {
                return res.status(422).send({ error: "This email address is already registered." });

            } else {
                const user = new User({
                    email,
                    is_admin: false,
                    is_developer: false,
                    password,
                    profile: { firstName, lastName },
                    status: "New User"
                });
                user.save(function(saveErr, newUser) {
                    if (saveErr) { return next(saveErr); }
                    const userInfo = newUser.toJSON();
                    res.status(201).json({
                        token: "Bearer " + jsonwebtoken.sign(userInfo, config.secret , { expiresIn: 10080 }),
                        user: userInfo
                    });
                });
            }
        });
    }

    // ========================================
    // Logout Route
    // ========================================
    public logout(req: Request, res: Response) {
        req.logOut();
    }

    public getUsers(req: Request, res: Response) {
        User.find({}, (err, users) => {
            if (err) {
                res.send(err);
            }
            res.status(200).send(users);
        });
    }

    public getUserById(req: Request, res: Response) {
        User.findById({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.status(200).send(user.toJSON());
        });
    }

    public updateUser(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.status(200).send(user.toJSON());
        });
    }

    public deleteUser(req: Request, res: Response) {
        if (!req.user) {
            res.status(401).send({ message: "You are log in"});
        }

        // if (!req.user.is_admin) {
        //     res.status(401).send({ message: "You are not admin"});
        // }

        User.remove({ _id: req.params.userId }, (err) => {
            if (err) {
                res.status(422).send({ message: "Unsuccessfully Delete User!"});
            }
            res.status(422).send({ message: "Successfully Deleted User!"});
        });
    }
}
