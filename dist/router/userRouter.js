"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
class UserRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.userController = new userController_1.UserController();
    }
    // Creates the routes for this router and returns a populated router object
    getRouter() {
        this.router.post("/user", this.userController.addNewUser);
        this.router.get("/user", this.userController.getUsers);
        this.router.get("/user/:userId", this.userController.getUserById);
        this.router.put("/user/:userId", this.userController.updateUser);
        this.router.delete("/user/:userId", this.userController.deleteUser);
        return this.router;
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=userRouter.js.map