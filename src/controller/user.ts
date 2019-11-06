import jsonwebtoken from "jsonwebtoken";
import { User, UserDocument } from "../Model/user";
import { Request, Response, NextFunction  } from "express";
import config from "../config/config";


export class UserController {

    //========================================
    // Login Route
    //========================================
    public postLogin(req: Request, res: Response, next: NextFunction){
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) { return res.status(400).json({ error: "bad data" }); }
            if (!user) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) { return res.status(400).json({ error: "bad data" }); }
                if (!isMatch) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
    
                    let userInfo = user.toJson();
                    res.status(200).json({
                        token: 'Bearer ' + jsonwebtoken.sign(userInfo, config.secret ,{ expiresIn: 10080 }),
                        user: userInfo
                    });
            });
        });
    }

    //========================================
    // Registration Route
    //========================================
    public register(req: Request, res: Response, next: NextFunction){
        // Check for registration errors
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        if (!email) {
            return res.status(422).send({ error: 'You must enter an email address.' });
        }
        if (!firstName || !lastName) {
            return res.status(422).send({ error: 'You must enter your full name.' });
        }
        if (!password) {
            return res.status(422).send({ error: 'You must enter a password.' });
        }

        User.findOne({ email: email }, function (err, existingUser) {
            if (err) { return next(err); }
            if (existingUser) {
                return res.status(422).send({ error: 'This email address is already registered.' });

            } else {
                let user = new User({
                    email: email,
                    password: password,
                    status: "New User",
                    developer: false,
                    is_admin: false,
                    profile: { firstName: firstName, lastName: lastName }
                });
                user.save(function (err, user) {
                    if (err) { return next(err); }
                    let userInfo = user.toJson();
                    res.status(201).json({
                        token: 'Bearer ' + jsonwebtoken.sign(userInfo, config.secret ,{ expiresIn: 10080 }),
                        user: userInfo
                    });
                });
            }
        });
    }

    public getUserById(req: Request, res: Response) {
        User.findById({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user.toJSON());
        });
    }

    public updateUser(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }

    public deleteUser(req: Request, res: Response) {
        User.remove({ _id: req.params.userId }, (err) => {
            if (err) {
                res.json({ message: "Unsuccessfully Delete User!"});
            }
            res.json({ message: "Successfully Deleted User!"});
        });
    }
}