import express from "express";
import {UserController} from "../controller/user";

export class UserRouter {
    private router: express.Router = express.Router();
    private userController: UserController = new UserController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.post("", this.userController.addNewUser);
        this.router.get("", this.userController.getUsers);
        this.router.get("/:userId", this.userController.getUserById);
        this.router.put("/:userId", this.userController.updateUser);
        this.router.delete("/:userId", this.userController.deleteUser);
        return this.router;
    }
}
