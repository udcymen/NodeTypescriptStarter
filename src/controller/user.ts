import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserSchema } from "../model/user";

const User = mongoose.model("User", UserSchema);

export class UserController {

    public addNewUser(req: Request, res: Response) {
        const newUser = new User(req.body);
        console.log(req.body);
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
