import express from "express";
import {UserController} from "../controller/user";

export class UserRouter {
    private router: express.Router = express.Router();
    private userController: UserController = new UserController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        
        this.router.get("/:userId", this.userController.getUserById);
        this.router.put("/:userId", this.userController.updateUser);
        this.router.delete("/:userId", this.userController.deleteUser);

        this.router.post("/login", this.userController.postLogin);
        this.router.post("/register", this.userController.register);
        return this.router;
    }
}