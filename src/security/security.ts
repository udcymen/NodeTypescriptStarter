import { User } from "../Model/user";
import { IUserRequest } from "../Interface/IUserRequest";
import { Request, Response } from "express";

exports.roles = {
    REQUIRE_ADMIN : "Admin",
    REQUIRE_OWNER : "Owner",
    REQUIRE_CLIENT : "Client",
    REQUIRE_MEMBER : "Member"};

//========================================
// Authorization Middleware
//========================================

// Role authorization check
exports.roleAuthorization = function (role: string) {
    return function (req: IUserRequest, res: Response, next: Function) {
        const user = req.user;

        User.findById(user._id, function (err, foundUser) {
            if (err) {
                res.status(422).json({ error: 'No user was found.' });
                return next(err);
            }

            // If user is found, check role.
            if (foundUser.role == role) {
                return next();
            }

            res.status(401).json({ error: 'You are not authorized to view this content.' });
            return next('Unauthorized');
        })
    }
}