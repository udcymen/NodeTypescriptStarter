import { Request, Response } from "express";
import mongoose from "mongoose";
import { User, UserDocument } from "../model/user";
import passportJWT from "passport-jwt";
import config from "../config/config";

const jwtOptions = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
};

export class UserController {
    public userLogin = new passportJWT.Strategy(jwtOptions, function (payload, done) {
        let id = new mongoose.Types.ObjectId(payload._id);
        User.findById(id, function (err, user) {
            if (err) { return done(err, false); }
    
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });

    public addNewUser(req: Request, res: Response) {
        const newUser = new User(req.body);
        newUser.save((err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }

    public getUsers(req: Request, res: Response) {
        User.find({}, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }

    public getUserById(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
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
